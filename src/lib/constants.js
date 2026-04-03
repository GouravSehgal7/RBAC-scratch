export const DEFAULT_ROLES = ['admin', 'viewer', 'analyst']
export const STATUS = {
    active : 'active',
    inactive : 'inactive',
    block : 'block'
}
export const TYPE = {
    income: 'income',
    expense: 'expense'
};
export const DEFAULT_PERMISSION_FOR_ADMIN = {
    attribute : "*",
    action : "*",
}
export const CATEGORY = {
     salary :"salary",
     food :"food",
     travel :"travel",
     rent :"rent",
     shopping :"shopping",
     health :"health",
     entertainment :"entertainment"
}

export const DEFAULTADMIN = {
    defaultAdminName : 'Super Admin',
    defaultAdminEmail : 'admin@example.com',
    defaultAdminPass : 'Admin123!'
}
export const RESOURCE_PERMISSION = {
    ROLEACTION:{
        ROLES:['admin'],
        PERMISSIONS:['*:*','role:read','role:edit','role:delete'],
        STAT:[STATUS.active]
    },
    EDITDASHBOARDDATA : {
        ROLES:['analyst'],
        PERMISSIONS:['dashboard:write'],
        STAT:[STATUS.active]
    },
    READDASHBOARDDATASUMMERY:{
        ROLES:['analyst'],
        PERMISSIONS:['dashboard:filter','dashboard:read','dashboard:summery'],
        STAT:[STATUS.active,STATUS.inactive]
    },
    READDASHBOARDDATA:{
        ROLES:['viewer', 'analyst'],
        PERMISSIONS:['dashboard:read'],
        STAT:[STATUS.active,STATUS.inactive]
    },
    UPDATE_USER_PERMISSIONS:{
        ROLES:['admin'],
        PERMISSIONS:['user:read','status:edit','ownership:edit','role:edit'],
        STAT:[STATUS.active]
    },
    LOGIN:{
        ROLES:['admin', 'viewer', 'analyst'],
        PERMISSIONS:['login:do'],
        STAT:[STATUS.active]
    }
}