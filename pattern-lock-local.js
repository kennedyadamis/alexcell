// Componente de Senha por Desenho Local - Versão 2.0
(function() {
    'use strict';

    function PatternLock(canvasSelector, options) {
        const canvas = document.querySelector(canvasSelector);
        if (!canvas) {
            console.error('PatternLock: Elemento canvas não encontrado.');
            return;
        }
        const ctx = canvas.getContext('2d');
        
        const defaultOptions = {
            matrix: [3, 3],
            margin: 25,
            dotRadius: 10,
            dotColor: '#dbe2ef',
            dotHoverColor: '#a7b8d4',
            lineColor: '#3f72af',
            lineWidth: 4
        };
        this.options = { ...defaultOptions, ...options };
        
        let dots = [], path = [], isDrawing = false, mousePos = { x: 0, y: 0 }, changeCallback = null;

        const init = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            setupDots();
            requestAnimationFrame(draw);
            attachEventListeners();
        };

        const setupDots = () => {
            dots = [];
            const [rows, cols] = this.options.matrix;
            const effectiveWidth = canvas.width - 2 * this.options.margin;
            const effectiveHeight = canvas.height - 2 * this.options.margin;
            
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    dots.push({
                        id: i * cols + j + 1,
                        x: this.options.margin + (effectiveWidth / (cols - 1)) * j,
                        y: this.options.margin + (effectiveHeight / (rows - 1)) * i,
                        isHovered: false
                    });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Desenha a linha do padrão
            if (path.length > 0) {
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
                ctx.strokeStyle = this.options.lineColor;
                ctx.lineWidth = this.options.lineWidth;
                ctx.stroke();
            }

            // Desenha os pontos
            dots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, this.options.dotRadius, 0, 2 * Math.PI);
                let color = dot.isHovered ? this.options.dotHoverColor : this.options.dotColor;
                if (path.includes(dot)) color = this.options.lineColor;
                ctx.fillStyle = color;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        };

        const getTouchPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        };

        const handleInteractionStart = (pos) => {
            isDrawing = true;
            // Removido this.reset() para não limpar padrão existente automaticamente
            update(pos);
        };
        
        const handleInteractionMove = (pos) => {
            if (!isDrawing) return;
            update(pos);
        };

        const handleInteractionEnd = () => {
            isDrawing = false;
            if (changeCallback) changeCallback(path.map(p => p.id).join(''));
        };

        const update = (pos) => {
            mousePos = pos;
            dots.forEach(dot => {
                const dist = Math.hypot(dot.x - mousePos.x, dot.y - mousePos.y);
                dot.isHovered = dist < this.options.dotRadius;
                if (dot.isHovered && !path.includes(dot)) path.push(dot);
            });
        };

        this.on = (event, callback) => {
            if (event === 'change') changeCallback = callback;
        };
        
        this.reset = () => {
            path = [];
            if (changeCallback) changeCallback('');
        };

        this.setPattern = (pattern) => {
            // Não resetar automaticamente para evitar piscar
            path = []; // Limpar apenas o path atual
            const patternDots = pattern.toString().split('').map(id => dots.find(d => d.id == id));
            if (patternDots.every(d => d)) { // Garante que todos os pontos foram encontrados
                path = patternDots;
            }
        };
        
        const attachEventListeners = () => {
            canvas.addEventListener('mousedown', e => handleInteractionStart({ x: e.offsetX, y: e.offsetY }));
            canvas.addEventListener('mousemove', e => handleInteractionMove({ x: e.offsetX, y: e.offsetY }));
            canvas.addEventListener('mouseup', handleInteractionEnd);
            canvas.addEventListener('mouseleave', handleInteractionEnd);

            canvas.addEventListener('touchstart', e => { e.preventDefault(); handleInteractionStart(getTouchPos(e)); }, { passive: false });
            canvas.addEventListener('touchmove', e => { e.preventDefault(); handleInteractionMove(getTouchPos(e)); }, { passive: false });
            canvas.addEventListener('touchend', handleInteractionEnd);
        };

        init();
    }
    window.PatternLock = PatternLock;
})();