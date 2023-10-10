
exports.up = knex => knex.schema.createTable('info_purchase', table => {
    table.increments('id').unique()
    table.string('arroba').notNullable()
    table.string('plan').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
});

exports.down = knex => knex.schema.dropTable('info_purchase');
