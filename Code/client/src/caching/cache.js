const CACHE_LIFETIME = 5000;

class Cache {
    data;
    age;
    #lifetime;

    constructor(lifetime=null) {
        if(!lifetime) {
            this.#lifetime = CACHE_LIFETIME;
        } else {
            this.#lifetime = lifetime;
        }

        this.age = this.#lifetime;
    }

    reset = () => {
        this.data = undefined;
        this.age = CACHE_LIFETIME;

        setTimeout(() => {
            this.reset();
        }, CACHE_LIFETIME)
    }

    alive = () => {
        return this.age < this.#lifetime;
    }
}

export default Cache;