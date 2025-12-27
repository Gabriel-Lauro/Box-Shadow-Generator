const elementos = {
    deslocamentoHorizontal: document.getElementById('deslocamentoHorizontal'),
    deslocamentoVertical: document.getElementById('deslocamentoVertical'),
    raioBlur: document.getElementById('raioBlur'),
    raioEspalhamento: document.getElementById('raioEspalhamento'),
    corSombra: document.getElementById('corSombra'),
    sombraInterna: document.getElementById('sombraInterna'),
    opacidadeSombra: document.getElementById('opacidadeSombra'),
    corFundo: document.getElementById('corFundo'),
    corCaixa: document.getElementById('corCaixa'),
    caixa: document.querySelector('.box'),
    caixaPreview: document.querySelector('.previewBox'),
    valorCodigo: document.querySelector('.codeValue'),
    botaoCopiar: document.querySelector('.copyButton')
};

function converterHexParaRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

function obterValoresSombra() {
    return {
        deslocamentoH: elementos.deslocamentoHorizontal.value,
        deslocamentoV: elementos.deslocamentoVertical.value,
        blur: elementos.raioBlur.value,
        espalhamento: elementos.raioEspalhamento.value,
        cor: elementos.corSombra.value,
        opacidade: (elementos.opacidadeSombra.value / 100).toFixed(2),
        inset: elementos.sombraInterna.checked ? 'inset ' : ''
    };
}

function gerarStringSombra(valores) {
    const rgbCor = converterHexParaRgb(valores.cor);
    return `${valores.inset}${valores.deslocamentoH}px ${valores.deslocamentoV}px ${valores.blur}px ${valores.espalhamento}px rgba(${rgbCor}, ${valores.opacidade})`;
}

function aplicarEstilosNaCaixa(stringSombra) {
    elementos.caixa.style.boxShadow = stringSombra;
    elementos.caixa.style.backgroundColor = elementos.corCaixa.value;
}

function aplicarCorDeFundo() {
    elementos.caixaPreview.style.backgroundColor = elementos.corFundo.value;
}

function atualizarCodigoCSS(stringSombra) {
    elementos.valorCodigo.textContent = stringSombra + ';';
}

function atualizarSombra() {
    const valores = obterValoresSombra();
    const stringSombra = gerarStringSombra(valores);
    
    aplicarEstilosNaCaixa(stringSombra);
    aplicarCorDeFundo();
    atualizarCodigoCSS(stringSombra);
}

function copiarCodigo() {
    const textoParaCopiar = `box-shadow: ${elementos.valorCodigo.textContent}`;
    
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        elementos.botaoCopiar.textContent = 'Copiado!';
        setTimeout(() => {
            elementos.botaoCopiar.textContent = 'Copiar código';
        }, 2000);
    });
}

function attachValueBadge(input, formatter) {
    const label = input.previousElementSibling;
    if (!label) return;

    // wrapper para agrupar badge e ícone de reset
    let actions = label.querySelector('.labelActions');
    if (!actions) {
        actions = document.createElement('span');
        actions.className = 'labelActions';
        label.appendChild(actions);
    }

    // badge de valor
    let badge = actions.querySelector('.valueBadge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'valueBadge';
        actions.appendChild(badge);
    }

    // ícone de reset (Google Icons)
    let reset = actions.querySelector('.resetIcon');
    if (!reset) {
        reset = document.createElement('span');
        reset.className = 'material-icons resetIcon';
        reset.textContent = 'refresh';
        reset.title = 'Restaurar padrão';
        actions.appendChild(reset);
    }

    const update = () => {
        badge.textContent = formatter(input.value);
    };

    input.addEventListener('input', update);

    reset.addEventListener('click', () => {
        input.value = input.defaultValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        update();
    });

    update();
}

function adicionarEventListeners() {
    elementos.deslocamentoHorizontal.addEventListener('input', atualizarSombra);
    elementos.deslocamentoVertical.addEventListener('input', atualizarSombra);
    elementos.raioBlur.addEventListener('input', atualizarSombra);
    elementos.raioEspalhamento.addEventListener('input', atualizarSombra);
    elementos.corSombra.addEventListener('input', atualizarSombra);
    elementos.sombraInterna.addEventListener('change', atualizarSombra);
    elementos.opacidadeSombra.addEventListener('input', atualizarSombra);
    elementos.corFundo.addEventListener('input', atualizarSombra);
    elementos.corCaixa.addEventListener('input', atualizarSombra);
    elementos.botaoCopiar.addEventListener('click', copiarCodigo);
}

function inicializar() {
    adicionarEventListeners();
    // indicadores de valor dos sliders
    attachValueBadge(elementos.deslocamentoHorizontal, v => `${v}px`);
    attachValueBadge(elementos.deslocamentoVertical, v => `${v}px`);
    attachValueBadge(elementos.raioBlur, v => `${v}px`);
    attachValueBadge(elementos.raioEspalhamento, v => `${v}px`);
    attachValueBadge(elementos.opacidadeSombra, v => `${v}%`);
    atualizarSombra();
}

inicializar();