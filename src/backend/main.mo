import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";

actor {
  // ── Migration stubs: keep old stable vars so Motoko doesn't complain ──
  stable let accessControlState = AccessControl.initState();
  public type _UserProfile = { name : Text };
  stable let userProfiles = Map.empty<Principal, _UserProfile>();

  // ── Legacy: keep old Tool/Category stable vars to satisfy upgrade compatibility ──
  public type _OldToolStatus = { #public_; #private_ };
  public type _OldTool = {
    id : Nat;
    name : Text;
    description : Text;
    targetAudience : Text;
    affiliateLink : ?Text;
    fallbackLink : Text;
    status : _OldToolStatus;
    emoji : ?Text;
    categoryId : ?Nat;
    sortOrder : Nat;
    createdAt : Int;
  };
  public type _OldCategory = { id : Nat; name : Text; createdAt : Int };
  stable let tools = Map.empty<Nat, _OldTool>();
  stable var nextToolId : Nat = 0;
  stable let categories = Map.empty<Nat, _OldCategory>();
  stable var nextCategoryId : Nat = 0;

  // ===== Content Types =====
  public type ContentRecord = {
    id : Nat;
    owner : Principal;
    topic : Text;
    timestamp : Int;
    hooks : [Text];
    script : Text;
    canvaTips : Text;
    caption : Text;
    hashtags : [Text];
  };

  public type Stats = {
    totalCount : Nat;
    recentCount : Nat;
  };

  // ===== Simple Tool Type =====
  public type Tool = {
    id : Nat;
    emoji : Text;
    name : Text;
    kurzbeschreibung : Text;
    zielgruppe : Text;
    affiliateLink : ?Text;
    fallbackLink : Text;
    reihenfolge : Nat;
    isPublic : Bool;
  };

  public type CreateToolArgs = {
    emoji : Text;
    name : Text;
    kurzbeschreibung : Text;
    zielgruppe : Text;
    affiliateLink : ?Text;
    fallbackLink : Text;
    reihenfolge : Nat;
    isPublic : Bool;
  };

  // ===== Stable Storage =====
  stable let contentRecords = Map.empty<Nat, ContentRecord>();
  stable var nextId : Nat = 0;

  stable let simpleTools = Map.empty<Nat, Tool>();
  stable var nextSimpleToolId : Nat = 0;

  // ===== Content Functions =====
  public shared ({ caller }) func saveContent(
    topic : Text,
    hooks : [Text],
    script : Text,
    canvaTips : Text,
    caption : Text,
    hashtags : [Text]
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };

    let record : ContentRecord = {
      id = nextId;
      owner = caller;
      topic = topic;
      timestamp = Time.now();
      hooks = hooks;
      script = script;
      canvaTips = canvaTips;
      caption = caption;
      hashtags = hashtags;
    };

    contentRecords.add(nextId, record);
    let currentId = nextId;
    nextId += 1;
    currentId;
  };

  public query ({ caller }) func getMyHistory() : async [ContentRecord] {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };
    contentRecords.values()
      .filter(func(record : ContentRecord) : Bool { record.owner == caller })
      .toArray();
  };

  public query ({ caller }) func getAllHistory() : async [ContentRecord] {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };
    contentRecords.values()
      .filter(func(record : ContentRecord) : Bool { record.owner == caller })
      .toArray();
  };

  public shared ({ caller }) func deleteContent(id : Nat) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };
    switch (contentRecords.get(id)) {
      case (null) { Runtime.trap("Content does not exist") };
      case (?record) {
        if (caller != record.owner) { Runtime.trap("Unauthorized") };
        contentRecords.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func bulkDelete(ids : [Nat]) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };
    var deletedCount : Nat = 0;
    for (id in ids.values()) {
      switch (contentRecords.get(id)) {
        case (null) {};
        case (?record) {
          if (caller == record.owner) {
            contentRecords.remove(id);
            deletedCount += 1;
          };
        };
      };
    };
    deletedCount;
  };

  public query ({ caller }) func getStats() : async Stats {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };
    let recentThreshold = Time.now() - (7 * 24 * 60 * 60 * 1_000_000_000);
    var recentCount : Nat = 0;
    var totalCount : Nat = 0;
    for (record in contentRecords.values()) {
      if (record.owner == caller) {
        totalCount += 1;
        if (record.timestamp > recentThreshold) {
          recentCount += 1;
        };
      };
    };
    { totalCount = totalCount; recentCount = recentCount };
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    not caller.isAnonymous();
  };

  // ===== Tool Functions =====
  // Reads: public, no auth needed (admin page protected by frontend login)
  public query func getPublicTools() : async [Tool] {
    simpleTools.values()
      .filter(func(t : Tool) : Bool { t.isPublic })
      .toArray();
  };

  public query func getAllToolsAdmin() : async [Tool] {
    simpleTools.values().toArray();
  };

  // Writes: require login
  public shared ({ caller }) func createTool(args : CreateToolArgs) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    let tool : Tool = {
      id = nextSimpleToolId;
      emoji = args.emoji;
      name = args.name;
      kurzbeschreibung = args.kurzbeschreibung;
      zielgruppe = args.zielgruppe;
      affiliateLink = args.affiliateLink;
      fallbackLink = args.fallbackLink;
      reihenfolge = args.reihenfolge;
      isPublic = args.isPublic;
    };
    simpleTools.add(nextSimpleToolId, tool);
    let tid = nextSimpleToolId;
    nextSimpleToolId += 1;
    tid;
  };

  public shared ({ caller }) func updateTool(id : Nat, args : CreateToolArgs) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    switch (simpleTools.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated : Tool = {
          id = existing.id;
          emoji = args.emoji;
          name = args.name;
          kurzbeschreibung = args.kurzbeschreibung;
          zielgruppe = args.zielgruppe;
          affiliateLink = args.affiliateLink;
          fallbackLink = args.fallbackLink;
          reihenfolge = args.reihenfolge;
          isPublic = args.isPublic;
        };
        simpleTools.add(id, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteTool(id : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    switch (simpleTools.get(id)) {
      case (null) { false };
      case (?_) { simpleTools.remove(id); true };
    };
  };
};
