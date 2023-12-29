module.exports.up = async function (knex) {
  await knex.schema.createTable("center_legals", (table) => {
    table.integer("center_id")
    // Main
    table.increments("id")
    table.text("first_name").notNullable()
    table.text("last_name").notNullable()
    table.text("rank")
    table.text("gender")
    table.text("phone").notNullable()
    table.text("photo").notNullable()
    table.text("cert_photo")
    // Status
    table.integer("approved_by")
    table.timestamp("approved_at")
    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")
    // Foreigns
    table.foreign("center_id").references("center_initials.id")
    table.foreign("approved_by").references("users.id")
    table.foreign("created_by").references("users.id")
    table.foreign("updated_by").references("users.id")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("center_legals")
}
