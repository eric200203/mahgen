import Mahgen from "./Mahgen";
import ParseError from "./ParseError";

class MahgenElement extends HTMLElement {
    private readonly img: HTMLImageElement;

    static get observedAttributes() {
        return [ 'data-seq' ];
    }

    constructor() {
        super();

        const root = this.attachShadow({ mode: 'open' });
        this.img = document.createElement('img');
        root.appendChild(this.img);
    }

    attributeChangedCallback() {
        this.genImage();
    }

    private genImage() {
        const seq = this.getAttribute('data-seq');
        const showMsg = this.hasAttribute('data-show-err');
        if(seq === null) {
            return;
        }

        Mahgen
            .render(seq)
            .then(base64 => {
                this.img.src = base64;
            })
            .catch(err => {
                if(err instanceof ParseError) {
                    console.error(`[Mahgen] invalid sequence "${seq}": ${err.message}.`);
                }

                this.img.src = '';
                this.img.alt = showMsg ? err.message : '';
            });
    }
}

export default MahgenElement;
