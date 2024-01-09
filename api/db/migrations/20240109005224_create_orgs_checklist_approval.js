module.exports.up = async function (knex) {
  await knex.schema.createTable("orgs_checklist_approval", (table) => {
    table.integer("org_id")
    // Main
    table.increments("id")
    table.text("status").defaultTo("pending")
    table.boolean("has_contracts_recently")
    table.boolean("is_center_unique")
    table.boolean("is_code_sync")
    table.boolean("is_login_info_correct")
    table.text("admin_comment")
    // Meta
    table.integer("created_by")
    table.integer("updated_by")
    table.timestamp("created_at")
    table.timestamp("updated_at")
    // Foreigns
    table.foreign("org_id").references("orgs.id")
    table.foreign("created_by").references("users.id")
    table.foreign("updated_by").references("users.id")
  })
}

module.exports.down = async function down(knex) {
  await knex.schema.dropTable("orgs_checklist_approval")
}
