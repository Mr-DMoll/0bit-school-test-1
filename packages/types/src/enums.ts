export enum Role {
  ADMIN   = "ADMIN",
  MANAGER = "MANAGER",
}

export enum AccountStatus {
  PENDING   = "PENDING",
  ACTIVE    = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED   = "DELETED",
}

export enum RegistrationMode {
  INVITE_ONLY         = "INVITE_ONLY",
  SELF_REGISTER       = "SELF_REGISTER",
  SELF_REGISTER_AUTO  = "SELF_REGISTER_AUTO",
}
