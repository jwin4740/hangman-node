db.createUser(
    {
        user: "textile_analytics",
        pwd: "r76f12iyid",
        roles: [
            {
                role: "userAdminAnyDatabase",
                db: "admin"
            },
            {
                role: "dbAdminAnyDatabase",
                db: "admin"
            },
            {
                role: "readWriteAnyDatabase",
                db: "admin"
            },
        ]
    }
)
