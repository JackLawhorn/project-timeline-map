import TreeController from './TreeController';
import TreeNode from './TreeNode';

export default class TreeRenderer {
  public _CTRL: TreeController;
  constructor(controller: TreeController) {
    this._CTRL = controller;
  }

  public getRenderedElements(
    coordinateSystem: (coords: { x: number; y: number }) => { x: number; y: number },
    utilBranchContext: { parentID: string; dX: number; dY: number } | undefined = undefined
  ): {
    renderedNodes: Array<any>;
    renderedConnectors: Array<any>;
    previewLayerElements: Array<any>;
  } {
    const { keyMap, nodeKeys, connectorKeys } = this.getElementsToDraw();

    const renderedNodes = nodeKeys.map(nodeID => {
      const coords = this.getNodeCoordinates(nodeID, coordinateSystem);
      const nodeShape: string =
        (keyMap.get(nodeID)?.descendants ?? []).length > 0 ? 'square' : 'circle';

      return {
        type: 'node',
        nodeShape: nodeShape,
        preview: false,

        id: nodeID,
        label: keyMap.get(nodeID)?.label,
        x: coords.x ?? coordinateSystem({ x: 0, y: 50 }),
        y: coords.y ?? coordinateSystem({ x: 0, y: 50 }),
        updateNode: keyMap.get(nodeID)?.updateNode,
      };
    });

    const renderedConnectors = connectorKeys.map(connection => {
      const from = this.getNodeCoordinates(connection[0], coordinateSystem),
        to = this.getNodeCoordinates(connection[1], coordinateSystem);

      return {
        type: 'line',
        cap: false,
        preview: false,
        line: `M${from.x},${from.y} L${to.x},${to.y}`,
        path: `M${from.x},${from.y} Q${from.x},${to.y} ${to.x},${to.y}`,
      };
    });

    renderedNodes
      .filter(node => node.nodeShape === 'circle')
      .forEach(node => {
        const endX = coordinateSystem({ x: 100, y: 0 }).x;
        renderedConnectors.push({
          type: 'line',
          cap: true,
          preview: false,
          line: `M${node.x},${node.y} L${endX},${node.y}`,
          path: `M${node.x},${node.y} L${endX},${node.y}`,
        });
      });

    const previewLayerElements: Array<any> = [];
    if (utilBranchContext !== undefined) {
      const from = renderedNodes.find(node => node.id === utilBranchContext.parentID);
      const to = {
        x: (from?.x ?? 0) - utilBranchContext.dX,
        y: (from?.y ?? 0) - utilBranchContext.dY,
      };

      previewLayerElements.push({
        type: 'line',
        cap: false,
        preview: true,
        line: `M${from?.x},${from?.y} Q${from?.x},${to.y} ${to.x},${to.y}`,
        path: `M${from?.x},${from?.y} Q${from?.x},${to.y} ${to.x},${to.y}`,
      });

      previewLayerElements.push({
        type: 'node',
        nodeShape: 'circle',
        actionLabel: () => {
          if (Math.abs(utilBranchContext.dX) <= utilBranchContext.dY)
            return 'Create new child node (before)';
          if (-1 * Math.abs(utilBranchContext.dX) >= utilBranchContext.dY)
            return 'Create new child node (after)';
          if (utilBranchContext.dX <= 0) return 'Push children forward';
          return 'Push after new parent';
        },

        id: '',
        label: '',
        x: to.x,
        y: to.y,
      });
    }

    return {
      renderedNodes,
      renderedConnectors,
      previewLayerElements,
    };
  }
  public getElementsToDraw() {
    const keyMap: Map<string, TreeNode> = this._CTRL.map(),
      nodeKeys: Array<string> = this._CTRL.keys(),
      connectorKeys: Array<Array<string>> = [];

    this._CTRL.toArray().forEach((from: TreeNode) => {
      from.descendants.forEach((to: TreeNode) => {
        connectorKeys.push([from._ID, to._ID]);
      });
    });

    return { keyMap, nodeKeys, connectorKeys };
  }

  /**
   * @public
   * @param {{ x: number; y: number }}   scalars      horizontal and vertical scalars
   * @param {number}                     scrollPosn   the canvas's scroll position
   * @param {{ wt: number; ht: number }} translators  any horizontal and vertical translating factors
   * @return {*} a function that translates a given pair of coordinates to the canvas coordinate system
   * @memberof TreeRenderer
   */
  public TO_CANVAS_COORDINATES(
    scalars: { wx: number; hx: number } = { wx: 1, hx: 1 },
    scrollPosn: number = 0,
    translators: { wt: number; ht: number } = { wt: 0, ht: 0 }
  ) {
    return (coords: { x: number; y: number }) => {
      const { x, y } = coords,
        { wx, hx } = scalars,
        { wt, ht } = translators;
      const orientation = true, // wx > hx,
        maxTreeDepth = this._CTRL.maxTreeDepth();

      const scrollOffset = (scrollPosn / Math.max(1, maxTreeDepth)) * wx * 100;
      const canvasX = x * wx - wt - scrollOffset,
        canvasY = y * hx - ht;

      return {
        x: orientation ? canvasX : canvasY,
        y: orientation ? canvasY : canvasX,
      };
    };
  }

  /**
   * @public
   * @param {{ x: number; y: number }}   scalars      horizontal and vertical scalars
   * @param {number}                     scrollPosn   the canvas's scroll position
   * @param {{ wt: number; ht: number }} translators  any horizontal and vertical translating factors
   * @return {*} a function that translates a given pair of coordinates from the canvas coordinate system
   * @memberof TreeRenderer
   */
  public FROM_CANVAS_COORDINATES(
    scalars: { wx: number; hx: number } = { wx: 1, hx: 1 },
    scrollPosn: number = 0,
    translators: { wt: number; ht: number } = { wt: 0, ht: 0 }
  ) {
    return (coords: { x: number; y: number }) => {
      const { x, y } = coords,
        { wx, hx } = scalars,
        { wt, ht } = translators;
      const orientation = true, // wx > hx,
        maxTreeDepth = this._CTRL.maxTreeDepth();

      const scrollOffset = (scrollPosn / Math.max(1, maxTreeDepth)) * wx * 100;
      const canvasX = (x + wt + scrollOffset) / wx,
        canvasY = (y + ht) / hx;

      return {
        x: orientation ? canvasX : canvasY,
        y: orientation ? canvasY : canvasX,
      };
    };
  }

  /**
   * @public
   * @param {string} nodeID   the ID of the node being searched for
   * @return {*} the x- and y-coodinates of the TreeNode with the given ID
   * @memberof TreeRenderer
   */
  public getNodeCoordinates(
    nodeID: string,
    coordinateSystem: (coords: { x: number; y: number }) => { x: number; y: number }
  ): any {
    const node: TreeNode | undefined = this._CTRL.searchByID(nodeID);
    if (!node) return undefined;

    const maxTreeDepth = this._CTRL.maxTreeDepth(),
      { nodeDepth, breadthFloor, breadthCeil } = this.findParamsAtTreeNode(nodeID);
    return coordinateSystem({
      x: (100 * nodeDepth) / (maxTreeDepth + 1),
      y: Math.round((breadthFloor + breadthCeil) / 2),
    });
  }

  /**
   * @public
   * @param {string} nodeID           the ID of the node being searched for
   * @param {TreeNode} root           the current TreeNode being operated on
   * @param {number} nodeDepth        the depth of the current TreeNode from the top of the tree
   * @param {number} breadthFloor     the breadth-wise floor of the area dedicated to this node's parent node
   * @param {number} breadthCeil      the breadth-wise ceiling of the area dedicated to this node's parent node
   * @return {*}                      params needed to render the TreeNode of the given ID
   * @memberof TreeRenderer
   */
  private findParamsAtTreeNode(
    nodeID: string,
    root: TreeNode | undefined = this._CTRL.root,
    nodeDepth: number = 0,
    breadthFloor: number = 0,
    breadthCeil: number = 100
  ): any {
    if (root === undefined) return;
    if (root._ID === nodeID) return { nodeDepth, breadthFloor, breadthCeil };
    if (root.descendants.length === 0) return undefined;

    // Recurr down the tree
    const floor2Ceiling = (breadthCeil - breadthFloor) / root.descendants.length;
    return root.descendants
      .map((node, childIndex) =>
        this.findParamsAtTreeNode(
          nodeID,
          node,
          nodeDepth + 1,
          breadthFloor + floor2Ceiling * childIndex,
          breadthFloor + floor2Ceiling * childIndex + floor2Ceiling
        )
      )
      .flat()
      .find(x => x !== undefined);
  }
}
