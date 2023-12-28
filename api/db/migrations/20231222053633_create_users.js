module.exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.integer("center_id")

    // Auth
    table.text("phone").unique()
    table.text("username").unique()
    table.text("password_hash")
    table.boolean("verified").defaultTo(false)
    table.boolean("is_admin").defaultTo(false)
    table.boolean("agreed").defaultTo(false)

    // General
    table.text("email").unique()
    table.text("first_name")
    table.text("last_name")
    table.text("photo")
    table.text("city")

    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("users")
}

//   table.integer('height').notNullable()
//   table.specificType('sports', 'text ARRAY').notNullable()
//   table.specificType('friends', 'integer ARRAY')
