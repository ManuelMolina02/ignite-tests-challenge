**RF** => Requisitos funcionais



## /users
    - deve criar um usuário
    - não deve criar dois usuários com o mesmo email

## /sessions
    - deve gerar um token de autenticação para o usuário
    - não deve gerar token para usuário inexistente
    - não deve gerar token para usuário com senha incorreta

## /profile
    - deve retornar a busca do perfil de usuário
    - permitir visualização apenas para usuário autenticado

## /statement
    - deve criar um depósito
    - deve criar um retirada

    - o depósito só poderá ser criado por um usuário autenticado

APPLICATION ROUTES

    - USERS [ok]
        - create user -> criar usuário
            testes ==> deve criar um usuário
                       não deve criar dois usuários com o mesmo email

    - USER PROFILE [ok]
        - get profile -> visualizar perfil

    - STATEMENTS
        - get balance -> saldo
        - get statement -> extrato

        - create deposit -> fazer depósito
        - create withdraw -> fazer retirada


    - AUTHENTICATION [ok]
        - create authentication -> gerar token te autenticação
