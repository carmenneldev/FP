import{a as y}from"./chunk-R26FGQ4L.js";import{da as m,fa as g,ha as $}from"./chunk-6QB5CJHO.js";import{B as h,t as v}from"./chunk-W6HB4DVC.js";import{Db as c,Eb as u,N as i,S as r,T as p,Vb as d,Wa as f,_a as s,aa as n,kb as b}from"./chunk-LWB6VDSI.js";var P=["*"],I=({dt:l})=>`
.p-floatlabel {
    display: block;
    position: relative;
}

.p-floatlabel label {
    position: absolute;
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
    transition-property: all;
    transition-timing-function: ease;
    line-height: 1;
    font-weight: ${l("floatlabel.font.weight")};
    inset-inline-start: ${l("floatlabel.position.x")};
    color: ${l("floatlabel.color")};
    transition-duration: ${l("floatlabel.transition.duration")};
}

.p-floatlabel:has(.p-textarea) label {
    top: ${l("floatlabel.position.y")};
    transform: translateY(0);
}

.p-floatlabel:has(.p-inputicon:first-child) label {
    inset-inline-start: calc((${l("form.field.padding.x")} * 2) + ${l("icon.size")});
}

.p-floatlabel:has(.ng-invalid.ng-dirty) label {
    color: ${l("floatlabel.invalid.color")};
}

.p-floatlabel:has(input:focus) label,
.p-floatlabel:has(input.p-filled) label,
.p-floatlabel:has(input:-webkit-autofill) label,
.p-floatlabel:has(textarea:focus) label,
.p-floatlabel:has(textarea.p-filled) label,
.p-floatlabel:has(.p-inputwrapper-focus) label,
.p-floatlabel:has(.p-inputwrapper-filled) label {
    top: ${l("floatlabel.over.active.top")};
    transform: translateY(0);
    font-size: ${l("floatlabel.active.font.size")};
    font-weight: ${l("floatlabel.label.active.font.weight")};
}

.p-floatlabel:has(input.p-filled) label,
.p-floatlabel:has(textarea.p-filled) label,
.p-floatlabel:has(.p-inputwrapper-filled) label {
    color: ${l("floatlabel.active.color")};
}

.p-floatlabel:has(input:focus) label,
.p-floatlabel:has(input:-webkit-autofill) label,
.p-floatlabel:has(textarea:focus) label,
.p-floatlabel:has(.p-inputwrapper-focus) label {
    color: ${l("floatlabel.focus.color")};
}

.p-floatlabel-in .p-inputtext,
.p-floatlabel-in .p-textarea,
.p-floatlabel-in .p-select-label,
.p-floatlabel-in .p-multiselect-label-container,
.p-floatlabel-in .p-autocomplete-input-multiple,
.p-floatlabel-in .p-cascadeselect-label,
.p-floatlabel-in .p-treeselect-label {
    padding-top: ${l("floatlabel.in.input.padding.top")};
}

.p-floatlabel-in:has(input:focus) label,
.p-floatlabel-in:has(input.p-filled) label,
.p-floatlabel-in:has(input:-webkit-autofill) label,
.p-floatlabel-in:has(textarea:focus) label,
.p-floatlabel-in:has(textarea.p-filled) label,
.p-floatlabel-in:has(.p-inputwrapper-focus) label,
.p-floatlabel-in:has(.p-inputwrapper-filled) label {
    top: ${l("floatlabel.in.active.top")};
}

.p-floatlabel-on:has(input:focus) label,
.p-floatlabel-on:has(input.p-filled) label,
.p-floatlabel-on:has(input:-webkit-autofill) label,
.p-floatlabel-on:has(textarea:focus) label,
.p-floatlabel-on:has(textarea.p-filled) label,
.p-floatlabel-on:has(.p-inputwrapper-focus) label,
.p-floatlabel-on:has(.p-inputwrapper-filled) label {
    top: 0;
    transform: translateY(-50%);
    border-radius: ${l("floatlabel.on.border.radius")};
    background: ${l("floatlabel.on.active.background")};
    padding: ${l("floatlabel.on.active.padding")};
}
`,M={root:({instance:l,props:e})=>["p-floatlabel",{"p-floatlabel-over":e.variant==="over","p-floatlabel-on":e.variant==="on","p-floatlabel-in":e.variant==="in"}]},w=(()=>{class l extends g{name="floatlabel";theme=I;classes=M;static \u0275fac=(()=>{let a;return function(t){return(a||(a=n(l)))(t||l)}})();static \u0275prov=i({token:l,factory:l.\u0275fac})}return l})();var V=(()=>{class l extends ${_componentStyle=p(w);variant="over";static \u0275fac=(()=>{let a;return function(t){return(a||(a=n(l)))(t||l)}})();static \u0275cmp=f({type:l,selectors:[["p-floatlabel"],["p-floatLabel"],["p-float-label"]],hostVars:8,hostBindings:function(o,t){o&2&&b("p-floatlabel",!0)("p-floatlabel-over",t.variant==="over")("p-floatlabel-on",t.variant==="on")("p-floatlabel-in",t.variant==="in")},inputs:{variant:"variant"},features:[d([w]),s],ngContentSelectors:P,decls:1,vars:0,template:function(o,t){o&1&&(c(),u(0))},dependencies:[v,m],encapsulation:2,changeDetection:0})}return l})();var x=class l{constructor(e){this.http=e}apiUrl=`${y.apiUrl}/Province`;provinces=[];getAll(){return this.http.get(this.apiUrl)}getById(e){return this.http.get(`${this.apiUrl}/${e}`)}create(e){return this.http.post(this.apiUrl,e)}update(e){return this.http.put(`${this.apiUrl}/${e.id}`,e)}delete(e){return this.http.delete(`${this.apiUrl}/${e}`)}static \u0275fac=function(a){return new(a||l)(r(h))};static \u0275prov=i({token:l,factory:l.\u0275fac,providedIn:"root"})};export{V as a,x as b};
