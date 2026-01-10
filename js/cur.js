var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

class Cursor {
    constructor() {
        this.pos = { curr: null, prev: null };
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    create() {
        if (document.getElementById("cursor")) return;

        this.cursor = document.createElement("div");
        this.cursor.id = "cursor";
        this.cursor.classList.add("hidden");
        document.body.append(this.cursor);

        // --- 設定小圓點 (原生游標) 的 SVG ---
        // 【關鍵修改】將 rgba 的最後一個數字 (透明度) 改為 0.5
        
        // 黑色小圓點 (適合亮色背景) - 透明度 0.5
        const svgBlack = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' fill='rgba(0, 0, 0, 0.5)' /></svg>") 4 4, auto`;
        
        // 白色小圓點 (適合深色背景) - 透明度 0.5
        const svgWhite = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' fill='rgba(255, 255, 255, 0.5)' /></svg>") 4 4, auto`;

        if (!document.getElementById("cursor-style")) {
            this.scr = document.createElement("style");
            this.scr.id = "cursor-style";
            this.scr.innerHTML = `
                * { cursor: ${svgBlack} !important; }
                [data-theme="dark"] * { cursor: ${svgWhite} !important; }
            `;
            document.head.appendChild(this.scr);
        }
    }

    isClickable(el) {
        const tags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'IMG'];
        if (tags.includes(el.tagName)) return true;
        try {
            if (window.getComputedStyle(el).cursor === 'pointer') return true;
        } catch (e) {}
        return false;
    }

    init() {
        document.addEventListener("mouseover", e => {
            let target = e.target;
            let isHover = false;
            for(let i=0; i<3; i++) {
                if(!target) break;
                if(this.isClickable(target)) {
                    isHover = true;
                    break;
                }
                target = target.parentElement;
            }
            if (isHover) {
                this.cursor.classList.add("hover");
            } else {
                this.cursor.classList.remove("hover");
            }
        });

        document.addEventListener("mousemove", e => {
            if (this.pos.curr == null) {
                this.pos.prev = { x: e.clientX, y: e.clientY };
                this.pos.curr = { x: e.clientX, y: e.clientY };
            } else {
                this.pos.curr = { x: e.clientX, y: e.clientY };
            }
            this.cursor.classList.remove("hidden");
        });

        document.addEventListener("mouseenter", () => this.cursor.classList.remove("hidden"));
        document.addEventListener("mouseleave", () => this.cursor.classList.add("hidden"));
        document.addEventListener("mousedown", () => this.cursor.classList.add("active"));
        document.addEventListener("mouseup", () => this.cursor.classList.remove("active"));
    }

    render() {
        if (this.pos.prev && this.pos.curr) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.cursor.style.left = `${this.pos.prev.x}px`;
            this.cursor.style.top = `${this.pos.prev.y}px`;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
})();