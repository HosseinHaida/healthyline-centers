module.exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    // Auth
    table.text("phone").unique().notNullable()
    table.text("username").unique()
    table.text("password_hash")
    table.boolean("verified").defaultTo(false)
    table.boolean("agreed").defaultTo(false)
    table.text("national_id")
    // Type
    table.boolean("is_admin").defaultTo(false)
    // If recognised as a Center login
    table.boolean("is_center_auth").defaultTo(false)
    table.integer("center_id")
    // If recognised as an Organization login
    table.boolean("is_org_auth")
    table.integer("org_id")
    table.text("org_rank")
    // General
    table.text("email").unique()
    table.text("first_name")
    table.text("last_name")
    table.text("gender")
    table.text("photo")
    table.text("city")
    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")
    table.timestamp("last_login")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("users")
}

//   table.integer('height').notNullable()
//   table.specificType('sports', 'text ARRAY').notNullable()
//   table.specificType('friends', 'integer ARRAY')
