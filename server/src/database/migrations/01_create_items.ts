import Knex from 'knex';
//COLOCADO COMO K MAISCULO SOMENTE PARA OBTER O TIPO DA INSTACNAI, PARA UTILIZAR NO TYPESCRIPT

export async function up(knex:Knex){
    //CRIAR A TABELA    
    return knex.schema.createTable('items', table => {
        table.increments('id').primary;
        table.string('image').notNullable();
        table.string('title').notNullable();
    });    
}

export async function down(knex:Knex){
    //VOLTAR ATRAS - DELETETAR A TABELA
    return knex.schema.dropTable('items');
}