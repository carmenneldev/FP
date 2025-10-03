import{a as Te}from"./chunk-2CEVVDGB.js";import{e as Ie}from"./chunk-F6E2PCO4.js";import{a as we}from"./chunk-2ZYGBJ4M.js";import{U as Ce,b as ye,ca as G,d as le,da as S,ea as U,fa as Y,ha as J,ma as xe,na as Fe}from"./chunk-6QB5CJHO.js";import{c as ve}from"./chunk-X4I2DCXD.js";import{A as K,B as be,j as A,k as he,l as q,m as H,n as W,t as Z,w as ae}from"./chunk-W6HB4DVC.js";import{$ as re,$b as fe,Bb as x,Cb as s,Ha as ce,Hb as v,Ib as Q,Jb as h,Ka as o,Kb as b,N as $,O as z,Ob as P,Pb as ie,Qb as _e,Rb as ue,T as E,Vb as N,Wa as M,Xa as R,Xb as j,Yb as me,Z as f,_ as g,_a as V,aa as F,ab as p,cc as ge,ga as y,ha as pe,hb as u,ib as l,ic as ne,jb as D,lb as de,mb as C,nb as L,ob as X,pb as ee,qb as te,rb as d,rc as T,sb as _,sc as O,tb as m,ub as k,vb as B,wb as I,xb as w}from"./chunk-LWB6VDSI.js";var Me=["content"],Ve=(t,a)=>({"p-progressbar p-component":!0,"p-progressbar-determinate":t,"p-progressbar-indeterminate":a}),De=t=>({$implicit:t});function Pe(t,a){if(t&1&&(d(0,"div"),P(1),_()),t&2){let e=s(2);D("display",e.value!=null&&e.value!==0?"flex":"none"),u("data-pc-section","label"),o(),ue("",e.value,"",e.unit,"")}}function Oe(t,a){t&1&&I(0)}function $e(t,a){if(t&1&&(d(0,"div",3)(1,"div",4),p(2,Pe,2,5,"div",5)(3,Oe,1,0,"ng-container",6),_()()),t&2){let e=s();C(e.valueStyleClass),D("width",e.value+"%")("background",e.color),l("ngClass","p-progressbar-value p-progressbar-value-animate"),u("data-pc-section","value"),o(2),l("ngIf",e.showValue&&!e.contentTemplate&&!e._contentTemplate),o(),l("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",j(11,De,e.value))}}function ze(t,a){if(t&1&&(d(0,"div",7),m(1,"div",8),_()),t&2){let e=s();C(e.valueStyleClass),l("ngClass","p-progressbar-indeterminate-container"),u("data-pc-section","container"),o(),D("background",e.color),u("data-pc-section","value")}}var Re=({dt:t})=>`
.p-progressbar {
    position: relative;
    overflow: hidden;
    height: ${t("progressbar.height")};
    background: ${t("progressbar.background")};
    border-radius: ${t("progressbar.border.radius")};
}

.p-progressbar-value {
    margin: 0;
    background: ${t("progressbar.value.background")};
}

.p-progressbar-label {
    color: ${t("progressbar.label.color")};
    font-size: ${t("progressbar.label.font.size")};
    font-weight: ${t("progressbar.label.font.weight")};
}

.p-progressbar-determinate .p-progressbar-value {
    height: 100%;
    width: 0%;
    position: absolute;
    display: none;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: width 1s ease-in-out;
}

.p-progressbar-determinate .p-progressbar-label {
    display: inline-flex;
}

.p-progressbar-indeterminate .p-progressbar-value::before {
    content: "";
    position: absolute;
    background: inherit;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    will-change: inset-inline-start, inset-inline-end;
    animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}

.p-progressbar-indeterminate .p-progressbar-value::after {
    content: "";
    position: absolute;
    background: inherit;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    will-change: inset-inline-start, inset-inline-end;
    animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
    animation-delay: 1.15s;
}

@-webkit-keyframes p-progressbar-indeterminate-anim {
    0% {
        inset-inline-start: -35%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
    100% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
}
@keyframes p-progressbar-indeterminate-anim {
    0% {
        inset-inline-start: -35%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
    100% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
}
@-webkit-keyframes p-progressbar-indeterminate-anim-short {
    0% {
        inset-inline-start: -200%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
    100% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
}
@keyframes p-progressbar-indeterminate-anim-short {
    0% {
        inset-inline-start: -200%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
    100% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
}
`,Qe={root:({instance:t})=>["p-progressbar p-component",{"p-progressbar-determinate":t.determinate,"p-progressbar-indeterminate":t.indeterminate}],value:"p-progressbar-value",label:"p-progressbar-label"},Se=(()=>{class t extends Y{name="progressbar";theme=Re;classes=Qe;static \u0275fac=(()=>{let e;return function(i){return(e||(e=F(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var oe=(()=>{class t extends J{value;showValue=!0;styleClass;valueStyleClass;style;unit="%";mode="determinate";color;contentTemplate;_componentStyle=E(Se);templates;_contentTemplate;ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;default:this._contentTemplate=e.template}})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=F(t)))(i||t)}})();static \u0275cmp=M({type:t,selectors:[["p-progressBar"],["p-progressbar"],["p-progress-bar"]],contentQueries:function(n,i,r){if(n&1&&(v(r,Me,4),v(r,G,4)),n&2){let c;h(c=b())&&(i.contentTemplate=c.first),h(c=b())&&(i.templates=c)}},inputs:{value:[2,"value","value",O],showValue:[2,"showValue","showValue",T],styleClass:"styleClass",valueStyleClass:"valueStyleClass",style:"style",unit:"unit",mode:"mode",color:"color"},features:[N([Se]),V],decls:3,vars:15,consts:[["role","progressbar",3,"ngStyle","ngClass"],["style","display:flex",3,"ngClass","class","width","background",4,"ngIf"],[3,"ngClass","class",4,"ngIf"],[2,"display","flex",3,"ngClass"],[1,"p-progressbar-label"],[3,"display",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngClass"],[1,"p-progressbar-value","p-progressbar-value-animate"]],template:function(n,i){n&1&&(d(0,"div",0),p(1,$e,4,13,"div",1)(2,ze,2,7,"div",2),_()),n&2&&(C(i.styleClass),l("ngStyle",i.style)("ngClass",me(12,Ve,i.mode==="determinate",i.mode==="indeterminate")),u("aria-valuemin",0)("aria-valuenow",i.value)("aria-valuemax",100)("data-pc-name","progressbar")("data-pc-section","root")("aria-label",i.value+i.unit),o(),l("ngIf",i.mode==="determinate"),o(),l("ngIf",i.mode==="indeterminate"))},dependencies:[Z,A,q,W,H,S],encapsulation:2,changeDetection:0})}return t})(),xi=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=R({type:t});static \u0275inj=z({imports:[oe,S,S]})}return t})();var Ee=(()=>{class t extends xe{pathId;ngOnInit(){this.pathId="url(#"+Ce()+")"}static \u0275fac=(()=>{let e;return function(i){return(e||(e=F(t)))(i||t)}})();static \u0275cmp=M({type:t,selectors:[["UploadIcon"]],features:[V],decls:6,vars:7,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["fill-rule","evenodd","clip-rule","evenodd","d","M6.58942 9.82197C6.70165 9.93405 6.85328 9.99793 7.012 10C7.17071 9.99793 7.32234 9.93405 7.43458 9.82197C7.54681 9.7099 7.61079 9.55849 7.61286 9.4V2.04798L9.79204 4.22402C9.84752 4.28011 9.91365 4.32457 9.98657 4.35479C10.0595 4.38502 10.1377 4.40039 10.2167 4.40002C10.2956 4.40039 10.3738 4.38502 10.4467 4.35479C10.5197 4.32457 10.5858 4.28011 10.6413 4.22402C10.7538 4.11152 10.817 3.95902 10.817 3.80002C10.817 3.64102 10.7538 3.48852 10.6413 3.37602L7.45127 0.190618C7.44656 0.185584 7.44176 0.180622 7.43687 0.175736C7.32419 0.063214 7.17136 0 7.012 0C6.85264 0 6.69981 0.063214 6.58712 0.175736C6.58181 0.181045 6.5766 0.186443 6.5715 0.191927L3.38282 3.37602C3.27669 3.48976 3.2189 3.6402 3.22165 3.79564C3.2244 3.95108 3.28746 4.09939 3.39755 4.20932C3.50764 4.31925 3.65616 4.38222 3.81182 4.38496C3.96749 4.3877 4.11814 4.33001 4.23204 4.22402L6.41113 2.04807V9.4C6.41321 9.55849 6.47718 9.7099 6.58942 9.82197ZM11.9952 14H2.02883C1.751 13.9887 1.47813 13.9228 1.22584 13.8061C0.973545 13.6894 0.746779 13.5241 0.558517 13.3197C0.370254 13.1154 0.22419 12.876 0.128681 12.6152C0.0331723 12.3545 -0.00990605 12.0775 0.0019109 11.8V9.40005C0.0019109 9.24092 0.065216 9.08831 0.1779 8.97579C0.290584 8.86326 0.443416 8.80005 0.602775 8.80005C0.762134 8.80005 0.914966 8.86326 1.02765 8.97579C1.14033 9.08831 1.20364 9.24092 1.20364 9.40005V11.8C1.18295 12.0376 1.25463 12.274 1.40379 12.4602C1.55296 12.6463 1.76817 12.7681 2.00479 12.8H11.9952C12.2318 12.7681 12.447 12.6463 12.5962 12.4602C12.7453 12.274 12.817 12.0376 12.7963 11.8V9.40005C12.7963 9.24092 12.8596 9.08831 12.9723 8.97579C13.085 8.86326 13.2378 8.80005 13.3972 8.80005C13.5565 8.80005 13.7094 8.86326 13.8221 8.97579C13.9347 9.08831 13.998 9.24092 13.998 9.40005V11.8C14.022 12.3563 13.8251 12.8996 13.45 13.3116C13.0749 13.7236 12.552 13.971 11.9952 14Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,i){n&1&&(re(),d(0,"svg",0)(1,"g"),m(2,"path",1),_(),d(3,"defs")(4,"clipPath",2),m(5,"rect",3),_()()()),n&2&&(C(i.getClassNames()),u("aria-label",i.ariaLabel)("aria-hidden",i.ariaHidden)("role",i.role),o(),u("clip-path",i.pathId),o(3),l("id",i.pathId))},encapsulation:2})}return t})();var Ne=["file"],je=["header"],Le=["content"],Ae=["toolbar"],qe=["chooseicon"],He=["filelabel"],We=["uploadicon"],Ze=["cancelicon"],Ke=["empty"],Ge=["advancedfileinput"],Ye=["basicfileinput"],Je=(t,a,e,n,i)=>({$implicit:t,uploadedFiles:a,chooseCallback:e,clearCallback:n,uploadCallback:i}),Xe=(t,a,e,n,i,r,c,se)=>({$implicit:t,uploadedFiles:a,chooseCallback:e,clearCallback:n,removeUploadedFileCallback:i,removeFileCallback:r,progress:c,messages:se}),et=t=>({$implicit:t});function tt(t,a){if(t&1&&m(0,"span"),t&2){let e=s(3);C(e.chooseIcon),u("aria-label",!0)("data-pc-section","chooseicon")}}function it(t,a){t&1&&m(0,"PlusIcon"),t&2&&u("aria-label",!0)("data-pc-section","chooseicon")}function nt(t,a){}function at(t,a){t&1&&p(0,nt,0,0,"ng-template")}function lt(t,a){if(t&1&&(d(0,"span"),p(1,at,1,0,null,11),_()),t&2){let e=s(4);u("aria-label",!0)("data-pc-section","chooseicon"),o(),l("ngTemplateOutlet",e.chooseIconTemplate||e._chooseIconTemplate)}}function ot(t,a){if(t&1&&(k(0),p(1,it,1,2,"PlusIcon",9)(2,lt,2,3,"span",9),B()),t&2){let e=s(3);o(),l("ngIf",!e.chooseIconTemplate&&!e._chooseIconTemplate),o(),l("ngIf",e.chooseIconTemplate||e._chooseIconTemplate)}}function st(t,a){if(t&1&&m(0,"span",21),t&2){let e=s(4);l("ngClass",e.uploadIcon),u("aria-hidden",!0)}}function rt(t,a){t&1&&m(0,"UploadIcon")}function pt(t,a){}function ct(t,a){t&1&&p(0,pt,0,0,"ng-template")}function dt(t,a){if(t&1&&(d(0,"span"),p(1,ct,1,0,null,11),_()),t&2){let e=s(5);u("aria-hidden",!0),o(),l("ngTemplateOutlet",e.uploadIconTemplate||e._uploadIconTemplate)}}function _t(t,a){if(t&1&&(k(0),p(1,rt,1,0,"UploadIcon",9)(2,dt,2,2,"span",9),B()),t&2){let e=s(4);o(),l("ngIf",!e.uploadIconTemplate&&!e._uploadIconTemplate),o(),l("ngIf",e.uploadIconTemplate||e._uploadIconTemplate)}}function ut(t,a){if(t&1){let e=w();d(0,"p-button",19),x("onClick",function(){f(e);let i=s(3);return g(i.upload())}),p(1,st,1,2,"span",20)(2,_t,3,2,"ng-container",9),_()}if(t&2){let e=s(3);l("label",e.uploadButtonLabel)("disabled",!e.hasFiles()||e.isFileLimitExceeded())("styleClass","p-fileupload-upload-button "+e.uploadStyleClass)("buttonProps",e.uploadButtonProps),o(),l("ngIf",e.uploadIcon),o(),l("ngIf",!e.uploadIcon)}}function mt(t,a){if(t&1&&m(0,"span",21),t&2){let e=s(4);l("ngClass",e.cancelIcon)}}function ft(t,a){t&1&&m(0,"TimesIcon"),t&2&&u("aria-hidden",!0)}function gt(t,a){}function ht(t,a){t&1&&p(0,gt,0,0,"ng-template")}function bt(t,a){if(t&1&&(d(0,"span"),p(1,ht,1,0,null,11),_()),t&2){let e=s(5);u("aria-hidden",!0),o(),l("ngTemplateOutlet",e.cancelIconTemplate||e._cancelIconTemplate)}}function vt(t,a){if(t&1&&(k(0),p(1,ft,1,1,"TimesIcon",9)(2,bt,2,2,"span",9),B()),t&2){let e=s(4);o(),l("ngIf",!e.cancelIconTemplate&&!e._cancelIconTemplate),o(),l("ngIf",e.cancelIconTemplate||e._cancelIconTemplate)}}function yt(t,a){if(t&1){let e=w();d(0,"p-button",19),x("onClick",function(){f(e);let i=s(3);return g(i.clear())}),p(1,mt,1,1,"span",20)(2,vt,3,2,"ng-container",9),_()}if(t&2){let e=s(3);l("label",e.cancelButtonLabel)("disabled",!e.hasFiles()||e.uploading)("styleClass","p-fileupload-cancel-button "+e.cancelStyleClass)("buttonProps",e.cancelButtonProps),o(),l("ngIf",e.cancelIcon),o(),l("ngIf",!e.cancelIcon)}}function Ct(t,a){if(t&1){let e=w();k(0),d(1,"p-button",16),x("focus",function(){f(e);let i=s(2);return g(i.onFocus())})("blur",function(){f(e);let i=s(2);return g(i.onBlur())})("onClick",function(){f(e);let i=s(2);return g(i.choose())})("keydown.enter",function(){f(e);let i=s(2);return g(i.choose())}),d(2,"input",7,0),x("change",function(i){f(e);let r=s(2);return g(r.onFileSelect(i))}),_(),p(4,tt,1,4,"span",17)(5,ot,3,2,"ng-container",9),_(),p(6,ut,3,6,"p-button",18)(7,yt,3,6,"p-button",18),B()}if(t&2){let e=s(2);o(),l("styleClass","p-fileupload-choose-button "+e.chooseStyleClass)("disabled",e.disabled||e.isChooseDisabled())("label",e.chooseButtonLabel)("buttonProps",e.chooseButtonProps),u("data-pc-section","choosebutton"),o(),l("multiple",e.multiple)("accept",e.accept)("disabled",e.disabled||e.isChooseDisabled()),u("aria-label",e.browseFilesLabel)("title","")("data-pc-section","input"),o(2),l("ngIf",e.chooseIcon),o(),l("ngIf",!e.chooseIcon),o(),l("ngIf",!e.auto&&e.showUploadButton),o(),l("ngIf",!e.auto&&e.showCancelButton)}}function xt(t,a){t&1&&I(0)}function Tt(t,a){t&1&&I(0)}function Ft(t,a){if(t&1&&m(0,"p-progressbar",22),t&2){let e=s(2);l("value",e.progress)("showValue",!1)}}function It(t,a){if(t&1&&m(0,"p-message",14),t&2){let e=a.$implicit;l("severity",e.severity)("text",e.text)}}function wt(t,a){if(t&1){let e=w();d(0,"img",33),x("error",function(i){f(e);let r=s(5);return g(r.imageError(i))}),_()}if(t&2){let e=s().$implicit,n=s(4);l("src",e.objectURL,ce)("width",n.previewWidth)}}function St(t,a){t&1&&m(0,"TimesIcon")}function Ut(t,a){}function Et(t,a){t&1&&p(0,Ut,0,0,"ng-template")}function Lt(t,a){if(t&1&&p(0,St,1,0,"TimesIcon",9)(1,Et,1,0,null,11),t&2){let e=s(5);l("ngIf",!e.cancelIconTemplate&&!e._cancelIconTemplate),o(),l("ngTemplateOutlet",e.cancelIconTemplate||e._cancelIconTemplate)}}function kt(t,a){if(t&1){let e=w();d(0,"div",24),p(1,wt,1,2,"img",27),d(2,"div",28)(3,"div",29),P(4),_(),d(5,"span",30),P(6),_()(),d(7,"div",31)(8,"p-button",32),x("onClick",function(i){let r=f(e).index,c=s(4);return g(c.remove(i,r))}),p(9,Lt,2,2,"ng-template",null,2,ne),_()()()}if(t&2){let e=a.$implicit,n=s(4);o(),l("ngIf",n.isImage(e)),o(3),ie(e.name),o(2),ie(n.formatSize(e.size)),o(2),l("disabled",n.uploading)("styleClass","p-fileupload-file-remove-button "+n.removeStyleClass)}}function Bt(t,a){if(t&1&&p(0,kt,11,5,"div",26),t&2){let e=s(3);l("ngForOf",e.files)}}function Mt(t,a){}function Vt(t,a){if(t&1&&p(0,Mt,0,0,"ng-template",25),t&2){let e=s(3);l("ngForOf",e.files)("ngForTemplate",e.fileTemplate||e._fileTemplate)}}function Dt(t,a){if(t&1&&(d(0,"div",23),p(1,Bt,1,1,"div",24)(2,Vt,1,2,null,25),_()),t&2){let e=s(2);o(),L(!e.fileTemplate&&!e._fileTemplate?1:-1),o(),L(e.fileTemplate||e._fileTemplate?2:-1)}}function Pt(t,a){t&1&&I(0)}function Ot(t,a){t&1&&I(0)}function $t(t,a){if(t&1&&p(0,Ot,1,0,"ng-container",11),t&2){let e=s(2);l("ngTemplateOutlet",e.emptyTemplate||e._emptyTemplate)}}function zt(t,a){if(t&1){let e=w();d(0,"div",6)(1,"input",7,0),x("change",function(i){f(e);let r=s();return g(r.onFileSelect(i))}),_(),d(3,"div",8),p(4,Ct,8,15,"ng-container",9)(5,xt,1,0,"ng-container",10)(6,Tt,1,0,"ng-container",11),_(),d(7,"div",12,1),x("dragenter",function(i){f(e);let r=s();return g(r.onDragEnter(i))})("dragleave",function(i){f(e);let r=s();return g(r.onDragLeave(i))})("drop",function(i){f(e);let r=s();return g(r.onDrop(i))}),p(9,Ft,1,2,"p-progressbar",13),ee(10,It,1,2,"p-message",14,X),p(12,Dt,3,2,"div",15)(13,Pt,1,0,"ng-container",10)(14,$t,1,1,"ng-container"),_()()}if(t&2){let e=s();C(e.styleClass),l("ngClass","p-fileupload p-fileupload-advanced p-component")("ngStyle",e.style),u("data-pc-name","fileupload")("data-pc-section","root"),o(),D("display","none"),l("multiple",e.multiple)("accept",e.accept)("disabled",e.disabled||e.isChooseDisabled()),u("aria-label",e.browseFilesLabel)("title","")("data-pc-section","input"),o(3),l("ngIf",!e.headerTemplate&&!e._headerTemplate),o(),l("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)("ngTemplateOutletContext",fe(24,Je,e.files,e.uploadedFiles,e.choose.bind(e),e.clear.bind(e),e.upload.bind(e))),o(),l("ngTemplateOutlet",e.toolbarTemplate||e._toolbarTemplate),o(),u("data-pc-section","content"),o(2),l("ngIf",e.hasFiles()),o(),te(e.msgs),o(2),l("ngIf",e.hasFiles()),o(),l("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",ge(30,Xe,e.files,e.uploadedFiles,e.choose.bind(e),e.clear.bind(e),e.removeUploadedFile.bind(e),e.remove.bind(e),e.progress,e.msgs)),o(),L((e.emptyTemplate||e._emptyTemplate)&&!e.hasFiles()&&!e.hasUploadedFiles()?14:-1)}}function Rt(t,a){if(t&1&&m(0,"p-message",14),t&2){let e=a.$implicit;l("severity",e.severity)("text",e.text)}}function Qt(t,a){if(t&1&&m(0,"span",37),t&2){let e=s(4);l("ngClass",e.uploadIcon)}}function Nt(t,a){t&1&&m(0,"UploadIcon",40),t&2&&l("styleClass","p-button-icon p-button-icon-left")}function jt(t,a){}function At(t,a){t&1&&p(0,jt,0,0,"ng-template")}function qt(t,a){if(t&1&&(d(0,"span",41),p(1,At,1,0,null,11),_()),t&2){let e=s(5);o(),l("ngTemplateOutlet",e._uploadIconTemplate||e.uploadIconTemplate)}}function Ht(t,a){if(t&1&&(k(0),p(1,Nt,1,1,"UploadIcon",38)(2,qt,2,1,"span",39),B()),t&2){let e=s(4);o(),l("ngIf",!e.uploadIconTemplate&&!e._uploadIconTemplate),o(),l("ngIf",e._uploadIconTemplate||e.uploadIconTemplate)}}function Wt(t,a){if(t&1&&p(0,Qt,1,1,"span",36)(1,Ht,3,2,"ng-container",9),t&2){let e=s(3);l("ngIf",e.uploadIcon),o(),l("ngIf",!e.uploadIcon)}}function Zt(t,a){if(t&1&&m(0,"span",43),t&2){let e=s(4);l("ngClass",e.chooseIcon)}}function Kt(t,a){t&1&&m(0,"PlusIcon"),t&2&&u("data-pc-section","uploadicon")}function Gt(t,a){}function Yt(t,a){t&1&&p(0,Gt,0,0,"ng-template")}function Jt(t,a){if(t&1&&(k(0),p(1,Kt,1,1,"PlusIcon",9)(2,Yt,1,0,null,11),B()),t&2){let e=s(4);o(),l("ngIf",!e.chooseIconTemplate&&!e._chooseIconTemplate),o(),l("ngTemplateOutlet",e.chooseIconTemplate||e._chooseIconTemplate)}}function Xt(t,a){if(t&1&&p(0,Zt,1,1,"span",42)(1,Jt,3,2,"ng-container",9),t&2){let e=s(3);l("ngIf",e.chooseIcon),o(),l("ngIf",!e.chooseIcon)}}function ei(t,a){if(t&1&&p(0,Wt,2,2)(1,Xt,2,2),t&2){let e=s(2);L(e.hasFiles()&&!e.auto?0:1)}}function ti(t,a){if(t&1&&(d(0,"span"),P(1),_()),t&2){let e=s(3);C(e.cx("filelabel")),o(),_e(" ",e.basicFileChosenLabel()," ")}}function ii(t,a){t&1&&I(0)}function ni(t,a){if(t&1&&p(0,ii,1,0,"ng-container",10),t&2){let e=s(3);l("ngTemplateOutlet",e.fileLabelTemplate||e._fileLabelTemplate)("ngTemplateOutletContext",j(2,et,e.files))}}function ai(t,a){if(t&1&&p(0,ti,2,3,"span",44)(1,ni,1,4,"ng-container"),t&2){let e=s(2);L(!e.fileLabelTemplate&&!e._fileLabelTemplate?0:1)}}function li(t,a){if(t&1){let e=w();d(0,"div",21),ee(1,Rt,1,2,"p-message",14,X),d(3,"p-button",34),x("onClick",function(){f(e);let i=s();return g(i.onBasicUploaderClick())})("keydown",function(i){f(e);let r=s();return g(r.onBasicKeydown(i))}),p(4,ei,2,1,"ng-template",null,2,ne),d(6,"input",35,3),x("change",function(i){f(e);let r=s();return g(r.onFileSelect(i))})("focus",function(){f(e);let i=s();return g(i.onFocus())})("blur",function(){f(e);let i=s();return g(i.onBlur())}),_()(),p(8,ai,2,1),_()}if(t&2){let e=s();C(e.styleClass),l("ngClass","p-fileupload p-fileupload-basic p-component"),u("data-pc-name","fileupload"),o(),te(e.msgs),o(2),de(e.style),l("styleClass","p-fileupload-choose-button "+e.chooseStyleClass)("disabled",e.disabled)("label",e.chooseButtonLabel)("buttonProps",e.chooseButtonProps),o(3),l("accept",e.accept)("multiple",e.multiple)("disabled",e.disabled),u("aria-label",e.browseFilesLabel)("data-pc-section","input"),o(2),L(e.auto?-1:8)}}var oi=({dt:t})=>`
.p-fileupload input[type="file"] {
    display: none;
}

.p-fileupload-advanced {
    border: 1px solid ${t("fileupload.border.color")};
    border-radius: ${t("fileupload.border.radius")};
    background: ${t("fileupload.background")};
    color: ${t("fileupload.color")};
}

.p-fileupload-header {
    display: flex;
    align-items: center;
    padding: ${t("fileupload.header.padding")};
    background: ${t("fileupload.header.background")};
    color: ${t("fileupload.header.color")};
    border-style: solid;
    border-width: ${t("fileupload.header.border.width")};
    border-color: ${t("fileupload.header.border.color")};
    border-radius: ${t("fileupload.header.border.radius")};
    gap: ${t("fileupload.header.gap")};
}

.p-fileupload-content {
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;
    gap: ${t("fileupload.content.gap")};
    transition: border-color ${t("fileupload.transition.duration")};
    padding: ${t("fileupload.content.padding")};
}

.p-fileupload-content .p-progressbar {
    width: 100%;
    height: ${t("fileupload.progressbar.height")};
}

.p-fileupload-file-list {
    display: flex;
    flex-direction: column;
    gap: ${t("fileupload.filelist.gap")};
}

.p-fileupload-file {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: ${t("fileupload.file.padding")};
    border-bottom: 1px solid ${t("fileupload.file.border.color")};
    gap: ${t("fileupload.file.gap")};
}

.p-fileupload-file:last-child {
    border-bottom: 0;
}

.p-fileupload-file-info {
    display: flex;
    flex-direction: column;
    gap: ${t("fileupload.file.info.gap")};
}

.p-fileupload-file-thumbnail {
    flex-shrink: 0;
}

.p-fileupload-file-actions {
    margin-left: auto;
}

.p-fileupload-highlight {
    border: 1px dashed ${t("fileupload.content.highlight.border.color")};
}

.p-fileupload-advanced .p-message {
    margin-top: 0;
}

.p-fileupload-basic {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: ${t("fileupload.basic.gap")};
}
`,si={root:({instance:t})=>`p-fileupload p-fileupload-${t.mode} p-component`,header:"p-fileupload-header",pcChooseButton:"p-fileupload-choose-button",pcUploadButton:"p-fileupload-upload-button",pcCancelButton:"p-fileupload-cancel-button",content:"p-fileupload-content",fileList:"p-fileupload-file-list",file:"p-fileupload-file",fileThumbnail:"p-fileupload-file-thumbnail",fileInfo:"p-fileupload-file-info",fileName:"p-fileupload-file-name",fileSize:"p-fileupload-file-size",pcFileBadge:"p-fileupload-file-badge",fileActions:"p-fileupload-file-actions",pcFileRemoveButton:"p-fileupload-file-remove-button"},ke=(()=>{class t extends Y{name="fileupload";theme=oi;classes=si;static \u0275fac=(()=>{let e;return function(i){return(e||(e=F(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var ri=(()=>{class t extends J{name;url;method="post";multiple;accept;disabled;auto;withCredentials;maxFileSize;invalidFileSizeMessageSummary="{0}: Invalid file size, ";invalidFileSizeMessageDetail="maximum upload size is {0}.";invalidFileTypeMessageSummary="{0}: Invalid file type, ";invalidFileTypeMessageDetail="allowed file types: {0}.";invalidFileLimitMessageDetail="limit is {0} at most.";invalidFileLimitMessageSummary="Maximum number of files exceeded, ";style;styleClass;previewWidth=50;chooseLabel;uploadLabel;cancelLabel;chooseIcon;uploadIcon;cancelIcon;showUploadButton=!0;showCancelButton=!0;mode="advanced";headers;customUpload;fileLimit;uploadStyleClass;cancelStyleClass;removeStyleClass;chooseStyleClass;chooseButtonProps;uploadButtonProps={severity:"secondary"};cancelButtonProps={severity:"secondary"};onBeforeUpload=new y;onSend=new y;onUpload=new y;onError=new y;onClear=new y;onRemove=new y;onSelect=new y;onProgress=new y;uploadHandler=new y;onImageError=new y;onRemoveUploadedFile=new y;fileTemplate;headerTemplate;contentTemplate;toolbarTemplate;chooseIconTemplate;fileLabelTemplate;uploadIconTemplate;cancelIconTemplate;emptyTemplate;advancedFileInput;basicFileInput;content;set files(e){this._files=[];for(let n=0;n<e.length;n++){let i=e[n];this.validate(i)&&(this.isImage(i)&&(i.objectURL=this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(e[n]))),this._files.push(e[n]))}}get files(){return this._files}get basicButtonLabel(){return this.auto||!this.hasFiles()?this.chooseLabel:this.uploadLabel??this.files[0].name}_files=[];progress=0;dragHighlight;msgs;uploadedFileCount=0;focus;uploading;duplicateIEEvent;translationSubscription;dragOverListener;uploadedFiles=[];sanitizer=E(ve);zone=E(pe);http=E(be);_componentStyle=E(ke);ngOnInit(){super.ngOnInit(),this.translationSubscription=this.config.translationObserver.subscribe(()=>{this.cd.markForCheck()})}ngAfterViewInit(){super.ngAfterViewInit(),ae(this.platformId)&&this.mode==="advanced"&&this.zone.runOutsideAngular(()=>{this.content&&(this.dragOverListener=this.renderer.listen(this.content.nativeElement,"dragover",this.onDragOver.bind(this)))})}_headerTemplate;_contentTemplate;_toolbarTemplate;_chooseIconTemplate;_uploadIconTemplate;_cancelIconTemplate;_emptyTemplate;_fileTemplate;_fileLabelTemplate;templates;ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"file":this._fileTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"toolbar":this._toolbarTemplate=e.template;break;case"chooseicon":this._chooseIconTemplate=e.template;break;case"uploadicon":this._uploadIconTemplate=e.template;break;case"cancelicon":this._cancelIconTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"filelabel":this._fileLabelTemplate=e.template;break;default:this._fileTemplate=e.template;break}})}basicFileChosenLabel(){return this.auto?this.chooseButtonLabel:this.hasFiles()?this.files&&this.files.length===1?this.files[0].name:this.config.getTranslation("fileChosenMessage")?.replace("{0}",this.files.length):this.config.getTranslation("noFileChosenMessage")||""}getTranslation(e){return this.config.getTranslation(e)}choose(){this.advancedFileInput?.nativeElement.click()}onFileSelect(e){if(e.type!=="drop"&&this.isIE11()&&this.duplicateIEEvent){this.duplicateIEEvent=!1;return}this.msgs=[],this.multiple||(this.files=[]);let n=e.dataTransfer?e.dataTransfer.files:e.target.files;for(let i=0;i<n.length;i++){let r=n[i];this.isFileSelected(r)||this.validate(r)&&(this.isImage(r)&&(r.objectURL=this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(n[i]))),this.files.push(n[i]))}this.onSelect.emit({originalEvent:e,files:n,currentFiles:this.files}),this.checkFileLimit(n),this.hasFiles()&&this.auto&&(this.mode!=="advanced"||!this.isFileLimitExceeded())&&this.upload(),e.type!=="drop"&&this.isIE11()?this.clearIEInput():this.clearInputElement()}isFileSelected(e){for(let n of this.files)if(n.name+n.type+n.size===e.name+e.type+e.size)return!0;return!1}isIE11(){if(ae(this.platformId))return!!this.document.defaultView.MSInputMethodContext&&!!this.document.documentMode}validate(e){if(this.msgs=this.msgs||[],this.accept&&!this.isFileTypeValid(e)){let n=`${this.invalidFileTypeMessageSummary.replace("{0}",e.name)} ${this.invalidFileTypeMessageDetail.replace("{0}",this.accept)}`;return this.msgs.push({severity:"error",text:n}),!1}if(this.maxFileSize&&e.size>this.maxFileSize){let n=`${this.invalidFileSizeMessageSummary.replace("{0}",e.name)} ${this.invalidFileSizeMessageDetail.replace("{0}",this.formatSize(this.maxFileSize))}`;return this.msgs.push({severity:"error",text:n}),!1}return!0}isFileTypeValid(e){let n=this.accept?.split(",").map(i=>i.trim());for(let i of n)if(this.isWildcard(i)?this.getTypeClass(e.type)===this.getTypeClass(i):e.type==i||this.getFileExtension(e).toLowerCase()===i.toLowerCase())return!0;return!1}getTypeClass(e){return e.substring(0,e.indexOf("/"))}isWildcard(e){return e.indexOf("*")!==-1}getFileExtension(e){return"."+e.name.split(".").pop()}isImage(e){return/^image\//.test(e.type)}onImageLoad(e){window.URL.revokeObjectURL(e.src)}uploader(){if(this.customUpload)this.fileLimit&&(this.uploadedFileCount+=this.files.length),this.uploadHandler.emit({files:this.files}),this.cd.markForCheck();else{this.uploading=!0,this.msgs=[];let e=new FormData;this.onBeforeUpload.emit({formData:e});for(let n=0;n<this.files.length;n++)e.append(this.name,this.files[n],this.files[n].name);this.http.request(this.method,this.url,{body:e,headers:this.headers,reportProgress:!0,observe:"events",withCredentials:this.withCredentials}).subscribe(n=>{switch(n.type){case K.Sent:this.onSend.emit({originalEvent:n,formData:e});break;case K.Response:this.uploading=!1,this.progress=0,n.status>=200&&n.status<300?(this.fileLimit&&(this.uploadedFileCount+=this.files.length),this.onUpload.emit({originalEvent:n,files:this.files})):this.onError.emit({files:this.files}),this.uploadedFiles.push(...this.files),this.clear();break;case K.UploadProgress:{n.loaded&&(this.progress=Math.round(n.loaded*100/n.total)),this.onProgress.emit({originalEvent:n,progress:this.progress});break}}this.cd.markForCheck()},n=>{this.uploading=!1,this.onError.emit({files:this.files,error:n})})}}clear(){this.files=[],this.uploadedFileCount=0,this.onClear.emit(),this.clearInputElement(),this.msgs=[],this.cd.markForCheck()}remove(e,n){this.clearInputElement(),this.onRemove.emit({originalEvent:e,file:this.files[n]}),this.files.splice(n,1),this.checkFileLimit(this.files)}removeUploadedFile(e){let n=this.uploadedFiles.splice(e,1)[0];this.uploadedFiles=[...this.uploadedFiles],this.onRemoveUploadedFile.emit({file:n,files:this.uploadedFiles})}isFileLimitExceeded(){let n=this.auto?this.files.length:this.files.length+this.uploadedFileCount;return this.fileLimit&&this.fileLimit<=n&&this.focus&&(this.focus=!1),this.fileLimit&&this.fileLimit<n}isChooseDisabled(){return this.auto?this.fileLimit&&this.fileLimit<=this.files.length:this.fileLimit&&this.fileLimit<=this.files.length+this.uploadedFileCount}checkFileLimit(e){this.msgs??=[];let n=this.msgs.length>0&&this.fileLimit&&this.fileLimit<e.length;if(this.isFileLimitExceeded()||n){let i=`${this.invalidFileLimitMessageSummary.replace("{0}",this.fileLimit.toString())} ${this.invalidFileLimitMessageDetail.replace("{0}",this.fileLimit.toString())}`;this.msgs.push({severity:"error",text:i})}else this.msgs=this.msgs.filter(i=>!i.text.includes(this.invalidFileLimitMessageSummary))}clearInputElement(){this.advancedFileInput&&this.advancedFileInput.nativeElement&&(this.advancedFileInput.nativeElement.value=""),this.basicFileInput&&this.basicFileInput.nativeElement&&(this.basicFileInput.nativeElement.value="")}clearIEInput(){this.advancedFileInput&&this.advancedFileInput.nativeElement&&(this.duplicateIEEvent=!0,this.advancedFileInput.nativeElement.value="")}hasFiles(){return this.files&&this.files.length>0}hasUploadedFiles(){return this.uploadedFiles&&this.uploadedFiles.length>0}onDragEnter(e){this.disabled||(e.stopPropagation(),e.preventDefault())}onDragOver(e){this.disabled||(ye(this.content?.nativeElement,"p-fileupload-highlight"),this.dragHighlight=!0,e.stopPropagation(),e.preventDefault())}onDragLeave(e){this.disabled||le(this.content?.nativeElement,"p-fileupload-highlight")}onDrop(e){if(!this.disabled){le(this.content?.nativeElement,"p-fileupload-highlight"),e.stopPropagation(),e.preventDefault();let n=e.dataTransfer?e.dataTransfer.files:e.target.files;(this.multiple||n&&n.length===1)&&this.onFileSelect(e)}}onFocus(){this.focus=!0}onBlur(){this.focus=!1}formatSize(e){let r=this.getTranslation(U.FILE_SIZE_TYPES);if(e===0)return`0 ${r[0]}`;let c=Math.floor(Math.log(e)/Math.log(1024));return`${(e/Math.pow(1024,c)).toFixed(3)} ${r[c]}`}upload(){this.hasFiles()&&this.uploader()}onBasicUploaderClick(){this.basicFileInput?.nativeElement.click()}onBasicKeydown(e){switch(e.code){case"Space":case"Enter":this.onBasicUploaderClick(),e.preventDefault();break}}imageError(e){this.onImageError.emit(e)}getBlockableElement(){return this.el.nativeElement.children[0]}get chooseButtonLabel(){return this.chooseLabel||this.config.getTranslation(U.CHOOSE)}get uploadButtonLabel(){return this.uploadLabel||this.config.getTranslation(U.UPLOAD)}get cancelButtonLabel(){return this.cancelLabel||this.config.getTranslation(U.CANCEL)}get browseFilesLabel(){return this.config.getTranslation(U.ARIA)[U.BROWSE_FILES]}get pendingLabel(){return this.config.getTranslation(U.PENDING)}ngOnDestroy(){this.content&&this.content.nativeElement&&this.dragOverListener&&(this.dragOverListener(),this.dragOverListener=null),this.translationSubscription&&this.translationSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=F(t)))(i||t)}})();static \u0275cmp=M({type:t,selectors:[["p-fileupload"],["p-fileUpload"]],contentQueries:function(n,i,r){if(n&1&&(v(r,Ne,4),v(r,je,4),v(r,Le,4),v(r,Ae,4),v(r,qe,4),v(r,He,4),v(r,We,4),v(r,Ze,4),v(r,Ke,4),v(r,G,4)),n&2){let c;h(c=b())&&(i.fileTemplate=c.first),h(c=b())&&(i.headerTemplate=c.first),h(c=b())&&(i.contentTemplate=c.first),h(c=b())&&(i.toolbarTemplate=c.first),h(c=b())&&(i.chooseIconTemplate=c.first),h(c=b())&&(i.fileLabelTemplate=c.first),h(c=b())&&(i.uploadIconTemplate=c.first),h(c=b())&&(i.cancelIconTemplate=c.first),h(c=b())&&(i.emptyTemplate=c.first),h(c=b())&&(i.templates=c)}},viewQuery:function(n,i){if(n&1&&(Q(Ge,5),Q(Ye,5),Q(Le,5)),n&2){let r;h(r=b())&&(i.advancedFileInput=r.first),h(r=b())&&(i.basicFileInput=r.first),h(r=b())&&(i.content=r.first)}},inputs:{name:"name",url:"url",method:"method",multiple:[2,"multiple","multiple",T],accept:"accept",disabled:[2,"disabled","disabled",T],auto:[2,"auto","auto",T],withCredentials:[2,"withCredentials","withCredentials",T],maxFileSize:[2,"maxFileSize","maxFileSize",O],invalidFileSizeMessageSummary:"invalidFileSizeMessageSummary",invalidFileSizeMessageDetail:"invalidFileSizeMessageDetail",invalidFileTypeMessageSummary:"invalidFileTypeMessageSummary",invalidFileTypeMessageDetail:"invalidFileTypeMessageDetail",invalidFileLimitMessageDetail:"invalidFileLimitMessageDetail",invalidFileLimitMessageSummary:"invalidFileLimitMessageSummary",style:"style",styleClass:"styleClass",previewWidth:[2,"previewWidth","previewWidth",O],chooseLabel:"chooseLabel",uploadLabel:"uploadLabel",cancelLabel:"cancelLabel",chooseIcon:"chooseIcon",uploadIcon:"uploadIcon",cancelIcon:"cancelIcon",showUploadButton:[2,"showUploadButton","showUploadButton",T],showCancelButton:[2,"showCancelButton","showCancelButton",T],mode:"mode",headers:"headers",customUpload:[2,"customUpload","customUpload",T],fileLimit:[2,"fileLimit","fileLimit",e=>O(e,null)],uploadStyleClass:"uploadStyleClass",cancelStyleClass:"cancelStyleClass",removeStyleClass:"removeStyleClass",chooseStyleClass:"chooseStyleClass",chooseButtonProps:"chooseButtonProps",uploadButtonProps:"uploadButtonProps",cancelButtonProps:"cancelButtonProps",files:"files"},outputs:{onBeforeUpload:"onBeforeUpload",onSend:"onSend",onUpload:"onUpload",onError:"onError",onClear:"onClear",onRemove:"onRemove",onSelect:"onSelect",onProgress:"onProgress",uploadHandler:"uploadHandler",onImageError:"onImageError",onRemoveUploadedFile:"onRemoveUploadedFile"},features:[N([ke]),V],decls:2,vars:2,consts:[["advancedfileinput",""],["content",""],["icon",""],["basicfileinput",""],[3,"ngClass","ngStyle","class",4,"ngIf"],[3,"ngClass","class",4,"ngIf"],[3,"ngClass","ngStyle"],["type","file",3,"change","multiple","accept","disabled"],[1,"p-fileupload-header"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngTemplateOutlet"],[1,"p-fileupload-content",3,"dragenter","dragleave","drop"],[3,"value","showValue",4,"ngIf"],[3,"severity","text"],["class","p-fileupload-file-list",4,"ngIf"],[3,"focus","blur","onClick","keydown.enter","styleClass","disabled","label","buttonProps"],[3,"class",4,"ngIf"],[3,"label","disabled","styleClass","buttonProps","onClick",4,"ngIf"],[3,"onClick","label","disabled","styleClass","buttonProps"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],[3,"value","showValue"],[1,"p-fileupload-file-list"],[1,"p-fileupload-file"],["ngFor","",3,"ngForOf","ngForTemplate"],["class","p-fileupload-file",4,"ngFor","ngForOf"],["class","p-fileupload-file-thumbnail",3,"src","width","error",4,"ngIf"],[1,"p-fileupload-file-info"],[1,"p-fileupload-file-name"],[1,"p-fileupload-file-size"],[1,"p-fileupload-file-actions"],["text","","rounded","","severity","danger",3,"onClick","disabled","styleClass"],[1,"p-fileupload-file-thumbnail",3,"error","src","width"],[3,"onClick","keydown","styleClass","disabled","label","buttonProps"],["type","file",3,"change","focus","blur","accept","multiple","disabled"],["class","p-button-icon p-button-icon-left",3,"ngClass",4,"ngIf"],[1,"p-button-icon","p-button-icon-left",3,"ngClass"],[3,"styleClass",4,"ngIf"],["class","p-button-icon p-button-icon-left",4,"ngIf"],[3,"styleClass"],[1,"p-button-icon","p-button-icon-left"],["class","p-button-icon p-button-icon-left pi",3,"ngClass",4,"ngIf"],[1,"p-button-icon","p-button-icon-left","pi",3,"ngClass"],[3,"class"]],template:function(n,i){n&1&&p(0,zt,15,39,"div",4)(1,li,9,16,"div",5),n&2&&(l("ngIf",i.mode==="advanced"),o(),l("ngIf",i.mode==="basic"))},dependencies:[Z,A,he,q,W,H,Ie,oe,we,Te,Ee,Fe,S],encapsulation:2,changeDetection:0})}return t})(),Ki=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=R({type:t});static \u0275inj=z({imports:[ri,S,S]})}return t})();export{oe as a,xi as b,ri as c,Ki as d};
