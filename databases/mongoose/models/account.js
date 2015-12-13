var Schema = __db_mongoose.Schema,
  ObjectId = Schema.ObjectId;

var accountSchema = new Schema({
  local: {
    username: {type: String},
    email: {type: String},
    name: {
      first: {type: String},
      last: {type: String}
    },
    password: {
      hash: {type: String},
      salt: {type: String}
    },
    roles: [{type: Number}]
  },
  openid: [{
    provider: {type: String},
    id: {type: String},
    displayName: {type: String},
    name: {
      familyName: {type: String},
      givenName: {type: String},
      middleName: {type: String}
    },
    emails: [{
      value: {type: String},
      type: {type: String}
    }],
    photos: [{
      value: {type: String}
    }]
  }],

  notes: [ { type: ObjectId, ref: 'note' } ],

  updatedAt: {type: Date}

}, {
  collection: 'accounts'
});

// MAJ la date à chaque update.
accountSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

accountSchema.virtual('local.name.full').get(function() {
  return this.local.name.first + ' ' + this.local.name.last;
});

accountSchema.virtual('roles').get(function() {
  return this.local.roles;
});

accountSchema.virtual('hasRole').get(function(role) {
  var RolesEnum = Object.freeze({
    "DEFAULT": 1,
    "DEV": 2,
    "OP": 3
  });

  this.local.roles.forEach(function(roleCurrent) {
    if(roleCurrent == RolesEnum[role]) return true;
  });

  return false;
});

var Account = __db_mongoose.model('account', accountSchema);

module.exports = Account;