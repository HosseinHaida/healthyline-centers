module.exports.up = async function (knex) {
  await knex.schema.createTable("center_initials", (table) => {
    table.increments("id")

    // Main
    table.text("registration_name").notNullable()
    table.text("brand_name").notNullable()
    table.text("gis")
    table.text("postal_code").notNullable()
    table.text("exact_address").notNullable()
    table.specificType("phone", "text ARRAY").notNullable()
    table.text("website")

    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")

    // Foreigns
    table.foreign("created_by").references("users.id")
    table.foreign("updated_by").references("users.id")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("center_initials")
}
