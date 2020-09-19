const koa = require("koa")
const bodyparser = require("koa-bodyparser")

const server = new koa()

server.use(bodyparser())

const formatarReqSucesso = (ctx, dados, status=200) => {
    ctx.status = status
    ctx.body = {
        status: 'sucesso',
        dados: dados
    }
}

const formatarReqErro = (ctx, mensagem, status=404) => {
    ctx.status = status
    ctx.body = {
        status: 'erro',
        dados: {
            mensagem: mensagem
        }
    }
}


const produto = {
    id: 1,
    nome: 'Monitor 22"',
    quantidade: 3,
    valor: 50000,
    deletado: false
}

const estoque = {
    idProduto: 1,
    quantidade: produto.id.quantidade
}

const pedido = {
    id: 1,
    produtos: [{
        id: 1,
        nome: 'Monitor 22"',
        quantidade: 1,
        valor: 50000
    }],
    estado: 'incompleto',
    idCliente: 1,
    valorTotal: 0, //resultadoFuncao
    deletado: false
}

const listaProdutos = []
listaProdutos.push(produto)

const listaPedidos = []
listaPedidos.push(pedido)

const obterProdutos = () => {
    return listaProdutos.filter((produto) => !produto.deletado && produto.quantidade > 0)
}

const obterProdutoParticular = () => {
    return listaProdutos.filter((produto) => produto.id == undefined) //retornar id do produto que o usuário digitar?
}

const addProduto = (ctx) => {
    const body = ctx.request.body

    if (!body.nome || !body.quantidade || !body.valor) {
        formatarReqErro(ctx, 'Pedido mal-formatado!!', 400)
        return
    }
    const produto = {
        id: listaProdutos.length +1,
        nome: body.nome,
        quantidade: body.quantidade,
        valor: body.valor,
        deletado: false
    }

    listaProdutos.push(produto)
    return produto
}

const atualizarProduto = (ctx) => {
    const id = ctx.url.split('/')[2]
    const body = ctx.request.body

    if (!body.nome && !body.quantidade && !body.valor) {
        formatarReqErro(ctx, 'Pedido mal formatado!!!', 400)
    }

    if (id) {
        const produtoAtual = listaProdutos[id -1]
        if (produtoAtual) {
            const produtoAtualizado = {
                id: Number(id),
                nome: body.nome ? body.nome : produtoAtual.nome,
                quantidade: body.quantidade ? body.quantidade: produtoAtual.quantidade,
                valor: body.valor ? body.valor : produtoAtual.valor
            }
            listaProdutos[id -1] = produtoAtualizado
            return produtoAtualizado
        }
        
    } else {
        formatarReqErro(ctx, 'Pedido mal formatado!!!', 400)
    }
}


const deletarProduto = (ctx) => {
    const id = ctx.url.split('/')[2]
    const body = ctx.request.body

    if (typeof body.estado !== 'boolean') {
       formatarReqErro(ctx, 'Pedido mal-formatado!', 400)
    }

    if (id) {
        const produtoAtual = listaProdutos[id -1]
        if (produtoAtual) {
            if (body.estado === true) { //&& obterPostsDoAutor(id).length > 0
                formatarReqErro(ctx, 'Ação proibida', 403)
                return
            }
            const produtoAtualizado = {
                id: produtoAtual.id,
                nome: produtoAtual.nome,
                quantidade: produtoAtual.quantidade,
                valor: produtoAtual.valor,
                deletado: body.estado
            }
            listaProdutos[id -1] = produtoAtualizado
            return produtoAtualizado
        }
    }
}

const obterPedidos = () => {
    return listaPedidos.filter((pedido) => !pedido.deletado)
}

const obterPedidosEntregues = () => {
    return listaPedidos.filter((pedido) => pedido.estado === 'entregue')
}

const obterPedidosPagos = () => {
    return listaPedidos.filter((pedido) => pedido.estado === 'pago')
}

const obterPedidosProcessando = () => {
    return listaPedidos.filter((pedido) => pedido.estado === 'processando')
}

const obterPedidosCancelados = () => {
    return listaPedidos.filter((pedido) => pedido.estado === 'cancelado')
}


const addPedido = (ctx) => {
    const body = ctx.request.body

    if (!body.produtos || !body.estado || !body.valorTotal || !body.idCliente) {
        formatarReqErro(ctx, 'Pedido mal-formatado!!', 400)
        //return
    } else if (listaProdutos[body.idCliente -1].deletado === true) {
        formatarReqErro(ctx, 'Ação proibida', 403)
        return
    }
    const pedido = {
        id: listaPedidos.length +1,
        produtos: body.produtos,
        estado: body.estado,
        idCliente: body.idCliente,
        valorTotal: body.valorTotal,
        deletado: false
    }

    listaPedidos.push(pedido)
    return pedido
}

const deletarPedido = (ctx) => {
    const id = ctx.url.split('/')[2]
    const body = ctx.request.body

    if (typeof body.estado !== 'boolean') {
       formatarReqErro(ctx, 'Pedido mal-formatado!', 400)
    }
    if (id) {
        const pedidoAtual = listaPedidos[id -1]
        if (pedidoAtual) {
            const pedidoAtualizado = {
                id: pedidoAtual.id,
                produtos: pedidoAtual.produtos,
                estado: pedidoAtual.estado,
                idCliente: pedidoAtual.idCliente,
                valorTotal: pedidoAtual.valorTotal,
                deletado: body.estado
            }
            listaPedidos[id -1] = pedidoAtualizado
            return pedidoAtualizado
        }
    }
}

const atualizarPedido = (ctx) => {
    const id = ctx.url.split('/')[2]
    const body = ctx.request.body

    if (!body.produtos && !body.estado && !body.valorTotal || typeof body.deletado !== 'boolean') {
        formatarReqErro(ctx, 'Pedido mal formatado!!!', 400)
    }

    if (id) {
        const pedidoAtual = listaPedidos[id -1]
        if (pedidoAtual) {
            const pedidoAtualizado = {
                id: Number(id),
                produtos: body.produtos ? body.produtos : pedidoAtual.produtos,
                estado: body.estado ? body.estado : pedidoAtual.estado,
                idCliente: pedidoAtual.idCliente,
                valorTotal: body.valorTotal ? body.valorTotal : pedidoAtual.valorTotal,
                deletado: pedidoAtual.deletado,
            }
            listaPedidos[id -1] = pedidoAtualizado
            return pedidoAtualizado
        }
        
    } else {
        formatarReqErro(ctx, 'Pedido mal formatado!!!', 400)
    }
}

const rotasProdutos = (ctx, diretorio) => {
    switch (ctx.method) {
        case 'GET':
            const id = diretorio[2]
            if (id) {
                if (listaProdutos[id -1]) {
                    formatarReqSucesso(ctx, listaProdutos[id -1])
                } else {
                    formatarReqErro(ctx, 'Produto não encontrado!!', 404)
                }
            } else {
                formatarReqSucesso(ctx, obterProdutos())
            }
            break
        case 'POST':
            const produtoAdicionado = addProduto(ctx)
            if (produtoAdicionado) {
                formatarReqSucesso(ctx, produto, 201)
            }
            break
        case 'PUT':
            const produtoAtualizado = atualizarProduto(ctx)
            if (produtoAtualizado) {
                formatarReqSucesso(ctx, produto, 200)
            }
            break            
        case 'DELETE':
            const produtoDeletado = deletarProduto(ctx)
            if (produtoDeletado) {
                formatarReqSucesso(ctx, { mensagem: "Produto deletado!" }, 200)
            }
            break
        default:
            //erro
            formatarReqErro(ctx, "Método não permitido!!!", 405)
            break;
    }
 }
 const rotasPedidos = (ctx, diretorio) => {
    switch (ctx.method) {
        case 'GET':
            const id = diretorio[2]
            if (id) {
                if (listaPedidos[id -1]) {
                    formatarReqSucesso(ctx, listaPedidos[id -1])
                } else {
                    formatarReqErro(ctx, 'Pedido não encontrado!!', 404)
                }
            } else {
                formatarReqSucesso(ctx, obterPedidos())
            }
            break
        case 'POST':
            const pedidoAdicionado = addPedido(ctx)
            if (pedidoAdicionado) {
                formatarReqSucesso(ctx, pedidoAdicionado, 201)
            }
            break
        case 'PUT':
            const pedidoAtualizado = atualizarPedido(ctx)
            if (pedidoAtualizado) {
                formatarReqSucesso(ctx, pedidoAtualizado, 200)
            }
            break            
        case 'DELETE':
            const pedidoDeletado = deletarPedido(ctx)
            if (pedidoDeletado) {
                formatarReqSucesso(ctx, { mensagem: "Pedido deletado!" }, 200)
            }
            break
        default:
            formatarReqErro(ctx, "Método não permitido!!!", 405)
            break;
    }
 }

const rotas = (ctx) => {
    const diretorio = ctx.url.split("/")

    if (diretorio[1] === 'products') {
        rotasProdutos(ctx, diretorio)
    } else if (diretorio[1] === 'orders') {
        rotasPedidos(ctx, diretorio)
        rotasStatus(ctx, diretorio) //aqui <==========================
    } else {
       formatarReqErro(ctx, 'Conteúdo não encontrado!!', 404)
    }
}

const rotasStatus = (ctx) => {
    const diretorio = ctx.url.split("/")

    if (diretorio[1] === 'orders') {
        if (diretorio[2] === 'entregues') {
            rotaStatusEntregue(ctx, diretorio)
        }
        if (diretorio[2] === 'pagos') {
            rotaStatusPago(ctx, diretorio)
        }
        if (diretorio[2] === 'processando') {
            rotaStatusProcessando(ctx, diretorio)
        }
        if (diretorio[2] === 'cancelados') {
            rotaStatusCancelado(ctx, diretorio)
        }
    } else {
       formatarReqErro(ctx, 'Conteúdo não encontrado!!', 404)
    }
}

const rotaStatusEntregue = (ctx) => {
    switch (ctx.method) {
        case 'GET':
            formatarReqSucesso(ctx, obterPedidosEntregues())
            break
        default:
            formatarReqErro(ctx, "Método não permitido!!!", 405)
            break;
    }
}  

const rotaStatusPago = (ctx) => {
    switch (ctx.method) {
        case 'GET':
            formatarReqSucesso(ctx, obterPedidosPagos())
            break
        default:
            formatarReqErro(ctx, "Método não permitido!!!", 405)
            break;
    }
}  

const rotaStatusProcessando = (ctx) => {
    switch (ctx.method) {
        case 'GET':
            formatarReqSucesso(ctx, obterPedidosProcessando())
            break
        default:
            formatarReqErro(ctx, "Método não permitido!!!", 405)
            break;
    }
}  

const rotaStatusCancelado = (ctx) => {
    switch (ctx.method) {
        case 'GET':
            formatarReqSucesso(ctx, obterPedidosCancelados())
            break
        default:
            formatarReqErro(ctx, "Método não permitido!!!", 405)
            break;
    }
}  

server.use((ctx) => {
    rotas(ctx)
})

server.listen(8080, () => console.log("Servidor rodando na porta 8080"))