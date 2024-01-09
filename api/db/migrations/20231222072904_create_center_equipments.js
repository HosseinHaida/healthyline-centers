module.exports.up = async function (knex) {
  await knex.schema.createTable("center_equipments", (table) => {
    table.integer("center_id")
    // Main
    table.increments("id")
    table.text("name").notNullable()
    table.text("brand").notNullable()
    table.text("usage")
    table.text("catalog")
    table.text("photo")
    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")
    // Foreigns
    table.foreign("center_id").references("centers.id")
    table.foreign("created_by").references("users.id")
    table.foreign("updated_by").references("users.id")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("center_equipments")
}
