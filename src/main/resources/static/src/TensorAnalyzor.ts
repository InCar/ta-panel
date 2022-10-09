
export interface TJsonFields {
    [key: string]: { desc?: string, description?: string }
}

export class TensorAnalyzor {
    // ���õ��ֶ�
    private _jsonFields: TJsonFields | null = null;

    // ��ʼ��
    public init = async (): Promise<number> => {
        console.info(`TensorAnalyzor initialized.`);
        return 0;
    }

    public fetchJsonFields = async () : Promise<TJsonFields> => {
        if (this._jsonFields == null) {
            const api = "/api/fields";
            const resp = await fetch(api);
            const data = await resp.json();
            console.info(`${api} => ${Object.keys(data.fields).length}`);
            this._jsonFields = data.fields;
        }
        return this._jsonFields ?? {};
    }
}