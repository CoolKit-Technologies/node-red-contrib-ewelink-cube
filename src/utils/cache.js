/**
 * Cache for node data.
 */
function NodeDataCache() {
    // Cache data
    this.cache = [];
}

/**
 * Get cache size.
 */
NodeDataCache.prototype.size = function () {
    return this.cache.length;
};

/**
 * Get node data index.
 *
 * @param {string} id node id
 */
NodeDataCache.prototype.index = function (id) {
    const i = this.cache.findIndex((item) => item.id === id);
    return i;
};

/**
 * Check node data existence.
 *
 * @param {string} id node id
 */
NodeDataCache.prototype.has = function (id) {
    const i = this.index(id);
    return i !== -1;
};

/**
 * Add a new node data to cache.
 *
 * @param {*} node node data
 */
NodeDataCache.prototype.add = function (node) {
    if (!this.has(node.id)) {
        this.cache.push(node);
    }
};

/**
 * Remove a node data from cache.
 *
 * @param {string} id node id
 */
NodeDataCache.prototype.remove = function (id) {
    const i = this.index(id);
    if (i !== -1) {
        this.cache.splice(i, 1);
    }
};

/**
 * Get node data by id.
 *
 * @param {string} id node id
 */
NodeDataCache.prototype.getNodeData = function (id) {
    const i = this.index(id);
    if (i === -1) {
        return null;
    } else {
        return this.cache[i];
    }
};

/**
 * Clean cache.
 */
NodeDataCache.prototype.clean = function () {
    this.cache = [];
};

module.exports = {
    NodeDataCache
};
