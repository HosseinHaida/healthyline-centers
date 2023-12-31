module.exports.up = async function (knex) {
  await knex.schema.createTable("centers", (table) => {
    table.increments("id")
    // Main
    table.text("registration_name").notNullable()
    table.text("brand_name")
    table.text("province")
    table.text("city")
    table.text("gis")
    table.text("postal_code")
    table.text("exact_address")
    table.specificType("phone", "text ARRAY")
    table.text("website")
    table.text("university")
    table.text("representative_code")
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
  await knex.schema.dropTable("centers")
}
