import * as React from 'react'
import {Observer} from "mobx-react-lite";
import {AbstractColorAPI, ColorAPI1, ColorAPI2, ColorAPI3, ColorTypeStatus} from "../store/colorStore";
import {FC} from "react";

const api1 = new ColorAPI1();
const api2 = new ColorAPI2();
const api3 = new ColorAPI3();

const mockData1 = {color: "#000000", waitTime: 1000};
const mockData2 = {color: "#DA291C", waitTime: 2000};
const mockData3 = {color: "#E6C414", waitTime: 500};

const mockApi1 = new ColorAPI1(mockData1);
const mockApi2 = new ColorAPI2(mockData2);
const mockApi3 = new ColorAPI3(mockData3);

const APIViewer: FC<{ controller: AbstractColorAPI; }> = props => (
    <Observer>{() =>
        <div>
            <p style={{
                color: props.controller.color.value ? props.controller.color.value : "transparent"
            }}
            >██████ {props.controller.color.value} ██████</p>
            <p>{props.controller.status}</p>
            <button disabled={props.controller.status != ColorTypeStatus.init}
                    onClick={props.controller.fetchColor}>
                おす
            </button>
            <button disabled={props.controller.status != ColorTypeStatus.fetched}
                    onClick={props.controller.refetch}>
                再取得
            </button>
        </div>
    }</Observer>
);

const Index = () => (
    <div>
        <h2>モック</h2>
        <p>データ：{JSON.stringify(mockData1)}</p>
        <APIViewer controller={mockApi1}/>
        <p>データ：{JSON.stringify(mockData2)}</p>
        <APIViewer controller={mockApi2}/>
        <p>データ：{JSON.stringify(mockData3)}</p>
        <APIViewer controller={mockApi3}/>
        <hr/>
        <h2>ほんまもの</h2>
        <APIViewer controller={api1}/>
        <APIViewer controller={api2}/>
        <APIViewer controller={api3}/>
    </div>
);

export default Index;