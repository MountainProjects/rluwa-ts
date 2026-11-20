export interface ParsedSyntaxTree {
    root: AstStatBlock;
    commentLocations: ParsedLocation[];
}

export interface ParsedLocation {
    startsAt: AstPosition;
    endsAt: AstPosition;
}

export interface AstPosition {
    line: number;
    column: number;
}

export interface AstNode<Type extends string = string> {
    type: Type;
    startsAt: AstPosition;
    endsAt: AstPosition;
}

export interface AstStatBlock extends AstNode<"AstStatBlock"> {
    hasEnd: boolean;
    body: AstStatement[];
}

export interface AstStatFor extends AstNode<"AstStatFor"> {
    var: AstLocal;
    from: AstExpr;
    to: AstExpr;
    body: AstStatBlock;
    hasDo: boolean;
}

export interface AstStatExpr extends AstNode<"AstStatExpr"> {
    expr: AstExpr;
}

export type AstStatement =
    | AstStatBlock
    | AstStatFor
    | AstStatExpr;

export interface AstLocal extends AstNode<"AstLocal"> {
    luauType: LuauType | null;
    name: string;
    isConst: boolean;
}

export type AstExpr =
    | AstExprConstantNumber
    | AstExprConstantString
    | AstExprGlobal
    | AstExprCall;

export interface AstExprConstantNumber extends AstNode<"AstExprConstantNumber"> {
    value: number;
}

export interface AstExprConstantString extends AstNode<"AstExprConstantString"> {
    value: string;
}

export interface AstExprGlobal extends AstNode<"AstExprGlobal"> {
    global: string;
}

export interface AstExprCall extends AstNode<"AstExprCall"> {
    func: AstExpr;
    args: AstExpr[];
    self: boolean;
    argsStartsAt: AstPosition;
    argsEndsAt: AstPosition;
}

export type LuauType = unknown;