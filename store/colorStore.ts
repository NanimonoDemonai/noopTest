import {observable, configure, flow, action, runInAction, computed} from "mobx";
import {ColorResponse, ColorType, hexBotEndPoint, mockAdapterCreator, MockData, noopAPI} from "./api";
import {AxiosAdapter, AxiosResponse} from "axios";

configure({enforceActions: "observed"});

export enum ColorTypeStatus {
    init = "初期値",
    fetching = "フェッチ中",
    fetched = "フェッチ完了"
}

export abstract class AbstractColorAPI {
    @observable protected _color: ColorType = {value: "null"};
    @observable protected _status: ColorTypeStatus = ColorTypeStatus.init;
    private _adapter: AxiosAdapter | null;


    constructor(data?: MockData) {
        this._color = {value: "null"};
        this._status = ColorTypeStatus.init;
        this._adapter = data ? mockAdapterCreator(data) : null;
    }

    @computed get color() {
        return this._color;
    }

    @computed get status() {
        return this._status;
    }

    get isMock() {
        return this._adapter != null;
    }

    setMock(data: MockData) {
        this._adapter = mockAdapterCreator(data);
    }

    unSetMock() {
        this._adapter = null;
    }

    protected async get(): Promise<AxiosResponse<ColorResponse>> {
        return this._adapter != null
            ? noopAPI.get(hexBotEndPoint, {adapter: this._adapter})
            : noopAPI.get(hexBotEndPoint);
    }

    //ここを実装する
    abstract fetchColor(): void;

    @action.bound
    refetch() {
        this._status = ColorTypeStatus.init;
        this.fetchColor();
    }
}

export class ColorAPI1 extends AbstractColorAPI {
    @action.bound
    async fetchColor() {
        if (this._status != ColorTypeStatus.init) {
            throw new Error("フェッチ中か、フェッチ終わっとるわ");
        }
        this._status = ColorTypeStatus.fetching;


        const response = await this.get();

        runInAction(() => {
            this._status = ColorTypeStatus.fetched;
            this._color = {value: response.data.colors[0].value}
        })
    };
}

export class ColorAPI2 extends AbstractColorAPI {
    @action.bound
    async fetchColor() {
        if (this.status != ColorTypeStatus.init) {
            throw new Error("フェッチ中か、フェッチ終わっとるわ");
        }

        this.setStatus(ColorTypeStatus.fetching);

        const response = await this.get();
        this.setStatus(ColorTypeStatus.fetched);
        this.setColor({value: response.data.colors[0].value});
    };

    @action.bound
    private setColor(color: ColorType) {
        this._color = color;
    }

    @action.bound
    private setStatus(status: ColorTypeStatus) {
        this._status = status;
    }

}

export class ColorAPI3 extends AbstractColorAPI {
    fetchColor = flow(function* (this: ColorAPI3) {
        if (this._status != ColorTypeStatus.init) {
            throw new Error("フェッチ中か、フェッチ終わっとるわ");
        }
        this._status = ColorTypeStatus.fetching;


        const response = yield this.get();

        this._status = ColorTypeStatus.fetched;
        this._color = {value: response.data.colors[0].value}
    }).bind(this);
}


