const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const Usuario = require('./models/Usuario');
const Perfil = require('./models/perfil');
const Producto = require('./models/producto');
const Compra = require('./models/compra');
const Renta = require('./models/renta');
const Devolucion = require('./models/devolucion');

const uri = "mongodb+srv://admin:1234@cluster0.6xhpsxt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

run().catch(console.dir);

const typeDefs = gql`

    type Perfil {
        id: ID!
        nombre: String!
    }

    input PerfilInput {
        nombre: String!
    }

    type Usuario {
        id: ID!
        rut: Int!
        email: String!
        pass: String!
        perfil: Perfil
    }
    
    type Producto {
        id: ID!
        idproducto: Int!
        precio: Int!
        disponibilidad: Int!
        autor: String!
    }

    type Compra {
        id: ID!
        idusuario: Usuario
        rut: Int!
        fecha: String!
        producto: Producto
    }

    type Renta {
        id: ID!
        idusuario: Usuario
        rut: Int!
        fecha: String!
        plazo: String!
        producto: Producto
    }
    
    type Devolucion {
        id: ID!
        fecha: String!
        biblioteca: String!
        producto: Producto
    }

    type Alert {
        message: String
    }

    input UsuarioInput {
        email: String!
        pass: String!
        perfil: String!
    }

    input ProductoInput {
        precio: Int!
        disponibilidad: Int!
        autor: String!
        idproducto: Int!
    }

    input CompraInput {
        idusuario: ID!
        rut: Int!
        fecha: String!
        producto: ProductoInput
    }

    input RentaInput {
        idusuario: ID!
        rut: Int!
        fecha: String!
        plazo: String!
        producto: ProductoInput
    }

    input DevolucionInput {
        fecha: String!
        biblioteca: String!
        producto: ProductoInput
    }

    type Query {
        getUsuarios: [Usuario]
        getPerfiles: [Perfil]
        getUsuario(id: Int): Usuario
        getPerfil(id: ID!): Perfil
        getDevolucion(id: ID!): Devolucion
    }

    type Mutation {
        addUsuario(input: UsuarioInput): Usuario
        addCompra(input: CompraInput): Compra
        addRenta(input: RentaInput): Renta
        updUsuario(id: Int, input: UsuarioInput): Usuario
        delUsuario(id: Int): Alert
        addPerfil(input: PerfilInput): Perfil
        updPerfil(id: ID!, input: PerfilInput): Perfil
        addDevolucion(input: DevolucionInput): Devolucion
    }
`;

const resolvers = {
    Query: {
        async getUsuarios(obj) {
            const usuarios = await Usuario.find();
            return usuarios;
        },
        async getPerfiles(obj) {
            const perfiles = await Perfil.find()
            return perfiles;
        },
        async getUsuario(obj, {id}) {
            const usuario = await Usuario.findById(id);
            return usuario;
        },
        async getPerfil(obj, {id}) {
            const perfiles = await Perfil.findById(id);
            return perfiles;
        },
        async getDevolucion(obj, {id}) {
            const devolucion = await Devolucion.findById(id);
            return devolucion;
        },
    },
    Mutation: {
        async addUsuario(obj, {input}) {
            let perfilBus = await Perfil.findById(input.perfil);

            if (!perfilBus) {
                throw new Error("El perfil no existe");
            } else {
                const usuarios = new Usuario({email: input.email, pass: input.pass, perfil: perfilBus._id})
                await usuarios.save();
                return usuarios;
            }
        },
        async updUsuario(obj, { id, input}) {
            let perfilBus = await Perfil.findById(input.perfil);
            if (!perfilBus) {
                throw new Error("El perfil no existe");
            } else {
                const usuarios = await Usuario.findByIdAndUpdate(id, input);
                return usuarios;
            }
        },
        async delUsuario(obj, { id }) {
            await Usuario.deleteOne({_id: id});
            return {
                message: `El Usuario ${id} fue eliminado`
            }
        },
        async addPerfil(obj, {input}) {
            const perfiles = new Perfil(input);
            await perfiles.save();
            return perfiles;
        },
        async updPerfil(obj, { id, input}) {
            const perfiles = await Perfil.findByIdAndUpdate(id, input);
            return perfiles;
        },
        async addCompra(obj, { input }) {
            const compra = new Compra({
                ...input,
                producto: new Producto(input.producto),
            });
            await compra.save();
            return compra;
        },
        async addRenta(obj, { input }) {
            const renta = new Renta({
                ...input,
                producto: new Producto(input.producto),
            });
            await renta.save();
            return renta;
        },
        async addDevolucion(obj, {input}) {
            const devolucion = new Devolucion(input);
            await devolucion.save();
            return devolucion;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await run();
    const { url } = await server.listen();
    console.log(`🚀 Server ready at ${url}`);
}

startServer().catch((error) => console.error(error));