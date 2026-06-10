/**
 * Engenharia IAV - Script Principal
 */

// Configuração de Cores para o Mapeamento
const MAPA_CORES = {
  'IGREJA': '#2AACE2',
  'SALAS MULTI USO': '#9B59B6',
  'REFEITÓRIO': '#F59E0B',
  'GINÁSIO': '#22C55E',
  'FÁBRICA': '#EF4444',
  'CASA PASTORAL': '#EC4899',
  'DORMITÓRIOS': '#94A3B8'
};

// Instâncias Globais
let mapaInstance = null;
let mapaMarkers = [];

// Sistema de Navegação entre Páginas Principais
function goPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.topbar .tab').forEach(t => t.classList.remove('active'));
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) targetPage.classList.add('active');
  
  // Define o estado ativo no botão clicado
  const event = window.event;
  if (event && event.target) event.target.classList.add('active');

  // Inicializa ou atualiza o tamanho do mapa se entrar na sub-aba correta
  if (pageId === 'dashboard' && mapaInstance) {
    setTimeout(() => { mapaInstance.invalidateSize(); }, 200);
  }
}

// Sistema de Navegação de Sub-Abas (Dashboard)
function goSub(subId) {
  document.querySelectorAll('.subpage').forEach(sp => sp.classList.remove('active'));
  document.querySelectorAll('.subtab').forEach(st => st.classList.remove('active'));
  
  const targetSub = document.getElementById(`sub-${subId}`);
  if (targetSub) targetSub.classList.add('active');

  const event = window.event;
  if (event && event.target) event.target.classList.add('active');

  if (subId === 'concluidas' && !mapaInstance) {
    inicializarMapa();
  }
}

// Inicialização Mock do Mapa (Leaflet)
function inicializarMapa() {
  const container = document.getElementById('mapaContainer');
  if (!container) return;

  // Centralizado por padrão no Brasil / Região Nordeste de atuação do IAV
  mapaInstance = L.map('mapaContainer').setView([-11.5, -42.5], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapaInstance);
}

// Filtragem do Mapa Dinâmico
function filtrarMapa(tipo, btn) {
  // Atualiza botões visuais
  document.querySelectorAll('.mapa-btn').forEach(b => {
    const t = b.dataset.tipo;
    const cor = t === 'TODOS' ? '#334155' : (MAPA_CORES[t] || '#666');
    if (b === btn) {
      b.style.background = cor;
      b.style.color = '#fff';
      b.style.borderColor = cor;
    } else {
      b.style.background = 'transparent';
      b.style.color = t === 'TODOS' ? '#334155' : (MAPA_CORES[t] || '#666');
      b.style.borderColor = t === 'TODOS' ? '#334155' : (MAPA_CORES[t] || '#666');
    }
  });

  let count = 0;
  mapaMarkers.forEach(m => {
    const visible = tipo === 'TODOS' || m.tipo === tipo;
    if (visible) { 
      m.addTo(mapaInstance); 
      count++; 
    } else if (mapaInstance.hasLayer(m)) { 
      mapaInstance.removeLayer(m); 
    }
  });

  const label = tipo === 'TODOS' ? '119 edificações visíveis' : `${count} edificação${count !== 1 ? 's' : ''} visível${count !== 1 ? 'is' : ''}`;
  const cont = document.getElementById('mapaContador');
  if (cont) cont.textContent = label;
}

function previewFoto(input) {
  const preview = document.getElementById('fFotoPreview');
  if (input.files && input.files[0] && preview) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    reader.readAsDataURL(input.files[0]);
  }
}

function salvarObra() {
  alert('Função salvarObra executada com sucesso.');
}

function cancelarEd() {
  const preview = document.getElementById('fFotoPreview');
  if (preview) preview.style.display = 'none';
}

function gerarArquivoCompartilhar() {
  alert('Preparando arquivo de sincronização...');
}
