import Knex from 'knex';
//COLOCADO COMO K MAISCULO SOMENTE PARA OBTER O TIPO DA INSTACNAI, PARA UTILIZAR NO TYPESCRIPT

export async function up(knex:Knex){
    //CRIAR A TABELA    
    return knex.schema.createTable('points_items', table => {
        table.increments('id').primary;
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    });    
}

export async function down(knex:Knex){
    //VOLTAR ATRAS - DELETETAR A TABELA
    return knex.schema.dropTable('points_items');
}