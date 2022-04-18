import TreeController from './TreeController';

export default class TreeNode {
  public controller: TreeController;
  public id: string = '';

  public label: string = 'Untitled';
  public info: string = 'This is the description for node "Untitled".';
  public descendants: Array<TreeNode> = [];

  constructor(label: string, controller: TreeController) {
    this.label = label;
    this.info = `This is the description for node "${label}".`;

    this.controller = controller;
    if (this.controller) this.id = this.controller.registerTreeNode(this);
  }

  /**
   * @public
   * @return {string} the ID of this TreeNode, unique to its TreeController
   * @memberof TreeNode
   */
  public get _ID(): string {
    return this.id;
  }

  /**
   * @public
   * @return {number} the depth of the tree represented by this TreeNode and its descendants
   * @memberof TreeNode
   */
  public get maxTreeDepth(): number {
    if (!this.hasNext()) return 0;
    return 1 + Math.max(...this.descendants.map(node => node.maxTreeDepth));
  }
  /**
   * @public
   * @return {boolean} does this TreeNode have descendants?
   * @memberof TreeNode
   */
  public hasNext(): boolean {
    return this.descendants.length > 0;
  }
  /**
   * @public
   * @return {Array<TreeNode>} an array of this TreeNode's descendants
   * @memberof TreeNode
   */
  public next(): Array<TreeNode> {
    return this.descendants;
  }

  /**
   * @public
   * @param {newDescendant} TreeNode  the descendant TreeNode to be appended
   * @return {TreeNode} the TreeNode appended
   * @memberof TreeNode
   */
  public appendChild(newDescendant: TreeNode): TreeNode {
    this.descendants.push(newDescendant);
    return newDescendant;
  }

  public findPath(id: string, prev: Array<string> = []): Array<string> {
    const path = [...prev, this.id];
    if (this.id === id) return path;
    if (!this.hasNext()) return [];
    const recur = this.descendants.map(node => node.findPath(id, path));
    return recur.filter(path => path.length > 0)[0];
  }

  public toArray(): Array<TreeNode> {
    let result: Array<TreeNode> = [this];
    if (this.hasNext()) result = result.concat(this.descendants.map(node => node.toArray()).flat());
    return result;
  }

  public updateNode(updatedProperties: any) {
    Object.assign(this, updatedProperties);
    return this;
  }
}
