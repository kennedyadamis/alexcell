// Módulo para gerenciar banners do carousel
import { supabase } from '../api/supabase.js';
import { dbSelect } from '../utils/authInterceptor.js';
import { initializeHeroCarousel } from './carousel.js';

// Função principal para carregar banners dinâmicos
export async function loadDynamicBanner() {
    try {
    
        
        const { data: settings, error } = await dbSelect('site_settings', {
            select: 'value',
            eq: { key: 'banner_slides' },
            single: true
        });

        if (error) {
            console.error('❌ Erro ao carregar configurações de banner:', error);
            createDefaultBanners();
            return;
        }

        if (!settings?.value?.slides || settings.value.slides.length === 0) {
    
            createDefaultBanners();
            return;
        }

        const banners = settings.value.slides;
    

        const carouselContainer = document.querySelector('.hero-carousel');
        if (!carouselContainer) {
            console.error('Container do carousel não encontrado');
            return;
        }

        // Limpa slides existentes
        carouselContainer.innerHTML = '';

        // Cria slides com dados do Supabase
        banners.forEach((banner, index) => {
            const slide = document.createElement('div');
            slide.className = `slide ${index === 0 ? 'active' : ''}`;
            
            // Aplicar imagem de fundo se disponível
            if (banner.image) {
                // Aplicar estilos de background diretamente
                const backgroundImageUrl = `url('${banner.image}')`;
                
                slide.style.setProperty('background-image', backgroundImageUrl, 'important');
                slide.style.setProperty('background-size', 'cover', 'important');
                slide.style.setProperty('background-position', 'center', 'important');
                slide.style.setProperty('background-repeat', 'no-repeat', 'important');
                slide.style.setProperty('background-color', '#2E8B57', 'important');
                

                
                // Preload da imagem para garantir carregamento
                const img = new Image();
                img.onload = () => {
                    // Força a aplicação da imagem após o carregamento
                    slide.style.setProperty('background-image', `url('${banner.image}')`, 'important');
                };
                img.onerror = (error) => {
                    console.error(`Erro ao carregar imagem: ${banner.image}`, error);
                    // Fallback para cor de fundo se a imagem falhar
                    slide.style.setProperty('background-image', 'none', 'important');
                    slide.style.setProperty('background-color', '#2E8B57', 'important');
                };
                img.src = banner.image;
                

                    
            } else {
                // Fallback para cor de fundo
                slide.style.setProperty('background-color', '#333333', 'important');
            }

            slide.innerHTML = `
                <div class="slide-content">
                    <h1>${banner.title || 'Título do Banner'}</h1>
                    <p>${banner.description || 'Descrição do banner'}</p>
                    ${banner.buttonLink ? 
                        `<a href="${banner.buttonLink}" class="btn btn-primary">${banner.buttonText || 'Saiba Mais'}</a>` : 
                        ''
                    }
                </div>
            `;

            carouselContainer.appendChild(slide);
        });

        // Adiciona navegação e dots
        const carouselSection = document.querySelector('.hero-carousel-section');
        
        // Remove navegação existente se houver
        const existingNav = carouselSection.querySelector('.carousel-nav');
        const existingDots = carouselSection.querySelector('.carousel-dots');
        if (existingNav) existingNav.remove();
        if (existingDots) existingDots.remove();

        // Adiciona nova navegação
        const navHTML = `
            <div class="carousel-nav" role="group" aria-label="Controles do carrossel">
                <button class="prev-btn" aria-label="Slide anterior">‹</button>
                <button class="next-btn" aria-label="Próximo slide">›</button>
            </div>
            <div class="carousel-dots" role="tablist" aria-label="Indicadores de slides"></div>
        `;
        
        carouselSection.insertAdjacentHTML('beforeend', navHTML);

        // Adiciona classe loaded para indicar que os banners foram carregados
        carouselContainer.classList.add('loaded');
        
        // Inicializa o carousel com os novos slides
        setTimeout(() => {
            initializeHeroCarousel();
        }, 100);

    } catch (error) {
        console.error('Erro inesperado ao carregar banners:', error);
        // Fallback para banners estáticos
        createDefaultBanners();
    }
}

// Função para criar banners padrão quando não há dados no Supabase
export function createDefaultBanners() {
    const defaultBanners = [
        {
            title: 'Tela Quebrada? Resolvemos na Hora!',
            description: 'Reparo de telas de todas as marcas com peças de alta qualidade e garantia. Seu celular novo de novo!',
            buttonText: 'Ver Serviços de Tela',
            buttonLink: 'servicos.html',
            image: 'logos/1.png'
        },
        {
            title: 'Especialistas em Reparo de Placa',
            description: 'Análise e reparo de placas com tecnologia de ponta. Não desista do seu aparelho!',
            buttonText: 'Saiba Mais sobre Reparos',
            buttonLink: 'servicos.html',
            image: 'logos/1.png'
        },
        {
            title: 'Bateria Nova, Vida Nova',
            description: 'Troca de baterias com agilidade para seu celular durar o dia todo.',
            buttonText: 'Orçamento para Bateria',
            buttonLink: 'servicos.html',
            image: 'logos/1.png'
        }
    ];

    const carouselContainer = document.querySelector('.hero-carousel');
    if (!carouselContainer) {
        console.error('Container do carousel não encontrado');
        return;
    }

    // Usa os slides existentes se já estiverem lá (evita recriar)
    const existingSlides = carouselContainer.querySelectorAll('.slide');
    if (existingSlides.length > 0) {
        setTimeout(() => {
            initializeHeroCarousel();
        }, 100);
        return;
    }

    // Limpa slides existentes apenas se necessário
    carouselContainer.innerHTML = '';

    // Cria slides com banners padrão
    defaultBanners.forEach((banner, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        if (banner.image) {
            slide.style.setProperty('background-image', `url('${banner.image}')`, 'important');
            slide.style.setProperty('background-size', 'cover', 'important');
            slide.style.setProperty('background-position', 'center', 'important');
            slide.style.setProperty('background-repeat', 'no-repeat', 'important');
        }
        slide.style.setProperty('background-color', '#2E8B57', 'important');

        slide.innerHTML = `
            <div class="slide-content">
                <h1>${banner.title}</h1>
                <p>${banner.description}</p>
                <a href="${banner.buttonLink}" class="btn btn-primary">${banner.buttonText}</a>
            </div>
        `;

        carouselContainer.appendChild(slide);
    });

    // Garante que a navegação existe
    const carouselSection = document.querySelector('.hero-carousel-section');
    if (!carouselSection.querySelector('.carousel-nav')) {
        const navHTML = `
            <div class="carousel-nav" role="group" aria-label="Controles do carrossel">
                <button class="prev-btn" aria-label="Slide anterior">‹</button>
                <button class="next-btn" aria-label="Próximo slide">›</button>
            </div>
            <div class="carousel-dots" role="tablist" aria-label="Indicadores de slides"></div>
        `;
        carouselSection.insertAdjacentHTML('beforeend', navHTML);
    }

    // Inicializa o carousel com os novos slides
    setTimeout(() => {
        initializeHeroCarousel();
    }, 100);
}