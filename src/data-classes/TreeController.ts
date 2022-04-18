import TreeNode from './TreeNode';
import TreeRenderer from './TreeRenderer';

export default class TreeController {
  public root: TreeNode | undefined;
  private idMap: Map<string, TreeNode> = new Map<string, TreeNode>();
  private _RNDR: TreeRenderer = new TreeRenderer(this);

  constructor() {}

  /**
   * @public
   * @return {string} an ID unique among all TreeNodes mapped in this TreeController
   * @memberof TreeController
   */
  public getUniqueID(): string {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
      result = '';

    for (var i = 0; i < 6; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      result += chars.substring(rnum, rnum + 1);
    }

    if (this.idMap.has(result)) return this.getUniqueID();
    else return result;
  }
  /**
   * @public
   * @param {newNode} TreeNode the new TreeNode to be registered
   * @return {string} the unique ID of the newly registered TreeNode
   * @memberof TreeController
   */
  public registerTreeNode(newNode: TreeNode): string {
    const UNIQUE_ID = this.getUniqueID();
    this.idMap.set(UNIQUE_ID, newNode);
    return UNIQUE_ID;
  }

  /**
   * @public
   * @return {boolean} does this TreeController have a root TreeNode?
   * @memberof TreeController
   */
  public hasRoot(): boolean {
    return this.root !== undefined;
  }
  /**
   * @public
   * @param {newRootLabel} string the label of the new Root
   * @return {TreeController} this TreeController object
   * @memberof TreeController
   */
  public addOrigin(newRootLabel: string = 'Origin'): TreeController {
    if (this.root !== undefined) return this;
    const newRoot = new TreeNode(newRootLabel, this);
    this.root = newRoot;
    return this;
  }

  /**
   * @public
   * @param {id} string the unique ID of the TreeNode
   * @return {boolean} is the given ID registered to a TreeNode in this TreeController?
   * @memberof TreeController
   */
  public hasNode(id: string): boolean {
    return this.idMap.has(id);
  }
  /**
   * @public
   * @param {id} string the unique ID of the TreeNode
   * @return {TreeNode | undefined} a TreeNode under this TreeController with the given ID
   * @memberof TreeController
   */
  public searchByID(id: string): TreeNode | undefined {
    return this.idMap.get(id);
  }

  /**
   * @public
   * @param {label} string the label of the TreeNode
   * @return {Array<TreeNode>} a TreeNode under this TreeController with the given ID
   * @memberof TreeController
   */
  public searchByLabel(label: string): Array<TreeNode> {
    return Object.values(this.idMap).filter(node => node.label === label);
  }

  /**
   * @public
   * @param {targetID} string the unique ID of the TreeNode being appended to
   * @param {newNode} TreeNode the new descendant TreeNode to append
   * @return {TreeNode | undefined} the appended TreeNode object
   * @memberof TreeController
   */
  public appendChild(
    targetID: string,
    newNode: TreeNode = new TreeNode('Untitled', this)
  ): TreeController {
    let targetNode: TreeNode | undefined = this.searchByID(targetID);
    targetNode?.appendChild(newNode);
    return this;
  }

  public updateNode(nodeID: string, updatedProperties: any): TreeController {
    this.searchByID(nodeID)?.updateNode(updatedProperties);
    return this;
  }
  public deleteNode(nodeID: string): TreeController {
    const allNodes = this.toArray(),
      deadNodes = this.searchByID(nodeID)?.toArray() ?? [];
    const deadIDs = deadNodes.map(node => node._ID);

    deadIDs.forEach(deadID => {
      this.idMap.delete(deadID);
    });
    allNodes.forEach(node => {
      node.descendants = [...node.descendants].filter(node => !deadIDs.includes(node._ID));
    });
    if (this.root?._ID === nodeID) this.root = undefined;

    return this;
  }

  public keys(): Array<string> {
    return Array.from(this.idMap.keys());
  }
  public map(): Map<string, TreeNode> {
    return this.idMap;
  }

  /*
   *
   * Methods passed from the root TreeNode
   *
   */
  public maxTreeDepth(): number {
    return this.root?.maxTreeDepth ?? 0;
  }
  public findPath(id: string): Array<string> {
    return this.root?.findPath(id) ?? [];
  }
  public findParentNode(id: string): TreeNode | undefined {
    if (!this.idMap.has(id)) return undefined;
    return this.toArray().find(
      node => node.descendants.filter(child => child._ID === id).length > 0
    );
  }
  public toArray(): Array<TreeNode> {
    return this.root?.toArray() ?? [];
  }

  /*
   *
   * Methods passed from the TreeRenderer
   *
   */
  public getNodeCoordinates(
    nodeID: string,
    coordSystemParams: {
      scalars: { wx: number; hx: number };
      scrollPosn: number;
      translators: { wt: number; ht: number };
    }
  ): { x: number; y: number } {
    return this._RNDR.getNodeCoordinates(
      nodeID,
      this._RNDR.TO_CANVAS_COORDINATES(
        coordSystemParams?.scalars ?? { wx: 1, hx: 1 },
        coordSystemParams?.scrollPosn ?? 0,
        coordSystemParams?.translators ?? { wt: 0, ht: 0 }
      )
    );
  }

  public getRenderedElements(
    coordSystemParams: {
      scalars: { wx: number; hx: number };
      scrollPosn: number;
      translators: { wt: number; ht: number };
    },
    utilBranchContext:
      | { parentID: string; dX: number; dY: number; ht: number }
      | undefined = undefined
  ): {
    renderedNodes: Array<any>;
    renderedConnectors: Array<any>;
    previewLayerElements: Array<any>;
  } {
    return this._RNDR.getRenderedElements(
      this._RNDR.TO_CANVAS_COORDINATES(
        coordSystemParams?.scalars ?? { wx: 1, hx: 1 },
        coordSystemParams?.scrollPosn ?? 0,
        coordSystemParams?.translators ?? { wt: 0, ht: 0 }
      ),
      utilBranchContext
    );
  }
}
