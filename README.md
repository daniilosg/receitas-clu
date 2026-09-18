# Cozinha com a Lu — PT-PT

Landing page estática em português de Portugal, baseada na referência fornecida.

## Estrutura
- `index.html` — página principal
- `css/style.css` — estilos responsivos
- `js/main.js` — FAQ, animações, carrosséis, UTMs e comportamento dos CTAs
- `Dockerfile` + `nginx.conf` — deploy com Nginx

## Executar com Docker
```bash
docker build -t cozinha-com-lu-ptpt .
docker run --rm -p 8080:80 cozinha-com-lu-ptpt
```

Depois abre `http://localhost:8080`.
