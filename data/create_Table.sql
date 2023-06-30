create table attractions(
        id bigint not null primary key,
        name varchar(255),
        category varchar(255),
        description varchar(10000) ,
        address varchar(1000),
        transport varchar(1000),
        mrt varchar(255),
        latitude FLOAT,
        longitude FLOAT,
        images JSON
        );

create table member(
        id bigint not null primary key auto_increment,
        name varchar(255),
        email varchar(255) unique,
        password varchar(255) not null
);