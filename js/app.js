
        // Mensajes por rol
        const roleMessages = {
            docente: "Gracias por ser el prólogo y guía de tantas historias de éxito.",
            administrativo: "Tu gestión es el índice fundamental que permite que el conocimiento fluya en orden.",
            escuela: "Eres el capítulo vivo donde se escriben los sueños de nuestra comunidad académica.",
            seguridad: "Tu labor es el soporte que mantiene viva nuestra casa de estudios.",
            transportes: "Eres el vínculo que conecta cada historia con su destino en nuestra universidad.",
            admision: "Gracias por ser la portada que da la bienvenida a cada nueva historia."
        };
        
        const roleNames = {
            docente: "Docente",
            administrativo: "Personal Administrativo",
            escuela: "Escuela Académica",
            seguridad: "Área de Seguridad",
            transportes: "Área de Transportes",
            admision: "Área de Admisión y Promoción"
        };
        
        // Generar ID único
        function generateUniqueID() {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 9000) + 1000;
            return `REG-2026-${random}`;
        }
        
        // Cambiar entre páginas con transición
        function showPage(pageId) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        // Manejar envío del formulario
        document.getElementById('membership-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const role = document.getElementById('role').value;
            
            if (!name || !role) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            document.getElementById('display-name').textContent = name;
            document.getElementById('display-role').textContent = roleNames[role];
            document.getElementById('display-message').textContent = `"${roleMessages[role]}"`;
            document.getElementById('display-registry').textContent = generateUniqueID();
            
            const card = document.getElementById('membership-card');
            card.classList.remove('card-generated');
            void card.offsetWidth;
            card.classList.add('card-generated');
            
            setTimeout(() => {
                showPage('card-page');
            }, 300);
        });
        
        // Función MEJORADA para descargar con dom-to-image (mejor calidad)
        async function downloadCard() {
            const card = document.getElementById('membership-card');
            const buttons = document.querySelector('.action-buttons');
            
            // Ocultar botones
            buttons.style.display = 'none';
            
            // Guardar estilos originales
            const originalBoxShadow = card.style.boxShadow;
            const originalTransform = card.style.transform;
            
            // Optimizar para captura
            card.style.boxShadow = 'none';
            card.style.transform = 'none';
            
            // Esperar que se apliquen los cambios
            await new Promise(resolve => setTimeout(resolve, 200));
            
            try {
                // Usar dom-to-image que tiene mejor renderizado
                const dataUrl = await domtoimage.toPng(card, {
                    quality: 1.0,
                    width: card.offsetWidth * 3,
                    height: card.offsetHeight * 3,
                    style: {
                        transform: 'scale(3)',
                        transformOrigin: 'top left',
                        width: card.offsetWidth + 'px',
                        height: card.offsetHeight + 'px'
                    },
                    bgcolor: '#f5f0e1'
                });
                
                // Descargar la imagen
                const link = document.createElement('a');
                const name = document.getElementById('display-name').textContent.replace(/\s+/g, '_');
                const timestamp = new Date().getTime();
                link.download = `Membresia_Amistad_${name}_${timestamp}.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
            } catch (error) {
                console.error('Error con dom-to-image, intentando método alternativo:', error);
                
                // Método alternativo: captura directa sin escala
                try {
                    const blob = await domtoimage.toBlob(card, {
                        bgcolor: '#f5f0e1',
                        quality: 1.0
                    });
                    
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const name = document.getElementById('display-name').textContent.replace(/\s+/g, '_');
                    link.download = `Membresia_Amistad_${name}.png`;
                    link.href = url;
                    link.click();
                    
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                } catch (error2) {
                    console.error('Error en método alternativo:', error2);
                    alert('Error al generar la imagen.\n\nSoluciones:\n1. Usa el botón "Imprimir PDF"\n2. Haz clic derecho > "Guardar imagen como"\n3. Usa la captura de pantalla de tu sistema');
                }
            } finally {
                // Restaurar estilos
                card.style.boxShadow = originalBoxShadow;
                card.style.transform = originalTransform;
                buttons.style.display = 'flex';
            }
        }
        
        // Función para imprimir
        function printCard() {
            window.print();
        }
        
        // Función para resetear
        function resetForm() {
            document.getElementById('membership-form').reset();
            document.getElementById('display-name').textContent = 'Tu Nombre Aquí';
            document.getElementById('display-role').textContent = 'Tu Rol';
            document.getElementById('display-message').textContent = '"Eres pieza fundamental de nuestra biblioteca de historias"';
            document.getElementById('display-registry').textContent = 'REG-2026-0000';
            
            showPage('form-page');
        }
        
        // Animación inicial
        window.addEventListener('load', function() {
            document.querySelector('.form-page').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.form-page').style.transition = 'opacity 0.6s ease-out';
                document.querySelector('.form-page').style.opacity = '1';
            }, 100);
        });