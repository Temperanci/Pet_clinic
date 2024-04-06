export interface Page<T> {
    datas: T[];
    total: number;
    limit: number;
}

export interface Permission {
    /**
     * 放行角色
     */
    role: string[];
}
