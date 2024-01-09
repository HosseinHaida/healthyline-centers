module.exports.up = async function (knex) {
  await knex.schema.createTable("orgs", (table) => {
    table.increments("id")
    table.integer("center_id")
    table.text("status").defaultTo("pending")
    // Main
    table.text("name").notNullable()
    table.text("main_org_code", 5)
    table.specificType("other_codes", "text ARRAY")
    table.text("size")
    table.text("province")
    table.text("city")
    // Org representative
    table.text("login_first_name")
    table.text("login_last_name")
    table.text("login_gender")
    table.text("login_phone")
    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")
    // Foreigns
    table.foreign("created_by").references("users.id")
    table.foreign("updated_by").references("users.id")
    table.foreign("center_id").references("centers.id")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("orgs")
}
