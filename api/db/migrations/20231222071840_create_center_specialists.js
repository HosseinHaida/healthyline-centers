module.exports.up = async function (knex) {
  await knex.schema.createTable("center_specialists", (table) => {
    table.integer("center_id")
    // Main
    table.increments("id")
    table.text("first_name").notNullable()
    table.text("last_name").notNullable()
    table.text("gender")
    table.text("rank")
    table.text("experience")
    table.text("photo")
    table.text("resume")
    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")
    // Foregins
    table.foreign("center_id").references("centers.id")
    table.foreign("created_by").references("users.id")
    table.foreign("updated_by").references("users.id")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("center_specialists")
}
