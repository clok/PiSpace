/*
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 *
 * Ported to to javascript by Jonas Wagner, 2010
 *
 * Some modifications for Impact by Dominic Szablewski, 2011
 *
 */

ig.module('plugins.box2d.lib').defines(function(){
    
    var b2 = {SCALE: 0.1}; 

    var a; 

    function extend(b,c){
	for(var d in c)b[d]=c[d]
    };
    b2.Settings=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.Settings.prototype.__constructor=function(){}; 
    b2.Settings.prototype.__varz=function(){}; 

    b2.Settings.USHRT_MAX=65535; 
    b2.Settings.pi=Math.PI; 
    b2.Settings.maxManifoldPoints=2; 
    b2.Settings.maxPolygonVertices=8; 
    b2.Settings.maxProxies=512; 
    b2.Settings.maxPairs=8*b2.Settings.maxProxies; 
    b2.Settings.linearSlop=0.005; 
    b2.Settings.angularSlop=2/180*b2.Settings.pi; 
    b2.Settings.toiSlop=8*b2.Settings.linearSlop; 

    b2.Settings.maxTOIContactsPerIsland=32; 
    b2.Settings.velocityThreshold=1; 
    b2.Settings.maxLinearCorrection=0.2; 
    b2.Settings.maxAngularCorrection=8/180*b2.Settings.pi; 
    b2.Settings.maxLinearVelocity=200; 
    b2.Settings.maxLinearVelocitySquared=b2.Settings.maxLinearVelocity*b2.Settings.maxLinearVelocity; 
    b2.Settings.maxAngularVelocity=250; 
    b2.Settings.maxAngularVelocitySquared=b2.Settings.maxAngularVelocity*b2.Settings.maxAngularVelocity; 
    b2.Settings.contactBaumgarte=0.2; 

    b2.Settings.timeToSleep=0.5; 
    b2.Settings.linearSleepTolerance=0.01; 
    b2.Settings.angularSleepTolerance=2/180;
    b2.Settings.Assert=function(b){
	b||(void 0).x++
    }; 

    b2.Vec2=function(b,c){
	if(arguments.length==2){
	    this.x=b; 
	    this.y=c}
    }; 
    b2.Vec2.Make=function(b,c){
	return new b2.Vec2(b,c)
    }; 
    
    a=b2.Vec2.prototype; 
    a.x=0; 
    a.y=0; 
    a.SetZero=function(){
	this.y=this.x=0
    }; 
    a.Set=function(b,c){
	this.x=b; 
	this.y=c
    }; 
    a.SetV=function(b){
	this.x=b.x; 
	this.y=b.y
    }; 
    a.Negative=function(){
	return new b2.Vec2(-this.x,-this.y)
    }; 
    a.Copy=function(){
	return new b2.Vec2(this.x,this.y)
    }; 
    a.Add=function(b){
	this.x+=b.x; 
	this.y+=b.y
    }; 
    a.Subtract=function(b){
	this.x-=b.x; 
	this.y-=b.y
    }; 
    a.Multiply=function(b){
	this.x*=b; 
	this.y*=b
    }; 
    a.MulM=function(b){
	var c=this.x; 
	this.x=b.col1.x*c+b.col2.x*this.y; 
	this.y=b.col1.y*c+b.col2.y*this.y
    }; 
    a.MulTM=function(b){
	var c=b2.Math.Dot(this,b.col1); 
	this.y=b2.Math.Dot(this,b.col2); 
	this.x=c
    }; 
    a.CrossVF=function(b){
	var c=this.x; 
	this.x=b*this.y; 
	this.y=-b*c
    }; 
    a.CrossFV=function(b){
	var c=this.x; 
	this.x=-b*this.y; 
	this.y=b*c
    }; 
    a.MinV=function(b){
	this.x=this.x<b.x?this.x:b.x; 
	this.y=this.y<b.y?this.y:b.y
    }; 
    a.MaxV=function(b){
	this.x=this.x>b.x?this.x:b.x; 
	this.y=this.y>b.y?this.y:b.y
    }; 
    a.Abs=function(){
	if(this.x<0)this.x=-this.x; 
	if(this.y<0)this.y=-this.y
    }; 
    a.Length=function(){
	return Math.sqrt(this.x*this.x+this.y*this.y)
    }; 
    a.LengthSquared=function(){
	return this.x*this.x+this.y*this.y
    }; 
    a.Normalize=function(){
	var b=Math.sqrt(this.x*this.x+this.y*this.y); 
	if(b<Number.MIN_VALUE)return 0; 
	var c=1/b; 
	this.x*=c; 
	this.y*=c; 
	return b
    }; 
    a.IsValid=function(){
	return b2.Math.IsValid(this.x)&&b2.Math.IsValid(this.y)
    }; 
    b2.BufferedPair=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.BufferedPair.prototype.__constructor=function(){
	
    }; 
    b2.BufferedPair.prototype.__varz=function(){}; 
    b2.BufferedPair.prototype.proxyId1=0; 
    b2.BufferedPair.prototype.proxyId2=0; 
    b2.AABB=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.AABB.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){
	this.lowerBound=new b2.Vec2; 
	this.upperBound=new b2.Vec2
    }; 
    a.lowerBound=new b2.Vec2; 
    a.upperBound=new b2.Vec2; 
    a.IsValid=function(){
	var b=this.upperBound.y-this.lowerBound.y; 
	return b=(b=this.upperBound.x-this.lowerBound.x>=0&&b>=0)&&this.lowerBound.IsValid()&&this.upperBound.IsValid()
    }; 

    b2.Pair=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.Pair.prototype.__constructor=function(){}; 
    b2.Pair.prototype.__varz=function(){}; 
    b2.Pair.nullPair=b2.Settings.USHRT_MAX; 
    b2.Pair.nullProxy=b2.Settings.USHRT_MAX; 
    b2.Pair.tableCapacity=b2.Settings.maxPairs; 
    b2.Pair.tableMask=b2.Pair.tableCapacity-1; 
    b2.Pair.e_pairBuffered=1; 
    b2.Pair.e_pairRemoved=2; 
    b2.Pair.e_pairFinal=4; 

    a=b2.Pair.prototype; 
    a.userData=null; 
    a.proxyId1=0; 
    a.proxyId2=0; 
    a.next=0; 
    a.status=0; 

    a.SetBuffered=function(){
	this.status|=b2.Pair.e_pairBuffered
    }; 
    a.ClearBuffered=function(){
	this.status&=~b2.Pair.e_pairBuffered
    }; 
    a.IsBuffered=function(){
	return(this.status&b2.Pair.e_pairBuffered)==b2.Pair.e_pairBuffered
    }; 
    a.SetRemoved=function(){
	this.status|=b2.Pair.e_pairRemoved
    }; 
    a.ClearRemoved=function(){
	this.status&=~b2.Pair.e_pairRemoved
    }; 
    a.IsRemoved=function(){
	return(this.status&b2.Pair.e_pairRemoved)==b2.Pair.e_pairRemoved
    }; 
    a.SetFinal=function(){
	this.status|=b2.Pair.e_pairFinal
    }; 
    a.IsFinal=function(){
	return(this.status&b2.Pair.e_pairFinal)==b2.Pair.e_pairFinal
    }; 

    b2.TimeStep=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.TimeStep.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){}; 
    a.dt=null; 
    a.inv_dt=null; 
    a.dtRatio=null; 
    a.maxIterations=0; 
    a.warmStarting=null; 
    a.positionCorrection=null; 

    b2.Manifold=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    a=b2.Manifold.prototype; 

    a.__constructor=function(){
	this.points=new Array(b2.Settings.maxManifoldPoints); 
	for(var b=0; 
	    b<b2.Settings.maxManifoldPoints; 
	    b++)this.points[b]=new b2.ManifoldPoint; 
	this.normal=new b2.Vec2
    }; 
    a.__varz=function(){}; 
    a.points=null; 
    a.normal=null; 
    a.pointCount=0; 
    a.Reset=function(){
	for(var b=0; 
	    b<b2.Settings.maxManifoldPoints; 
	    b++)this.points[b].Reset(); 
	this.normal.SetZero(); 
	this.pointCount=0
    }; 

    a.Set=function(b){
	this.pointCount=b.pointCount; 
	for(var c=0; 
	    c<b2.Settings.maxManifoldPoints; 
	    c++)this.points[c].Set(b.points[c]); 
	this.normal.SetV(b.normal)
    }; 
    b2.Point=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.Point.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){
	this.p=new b2.Vec2
    }; 
    a.p=new b2.Vec2; 
    a.Support=function(){
	return this.p
    }; 
    a.GetFirstVertex=function(){
	return this.p
    }; 
    b2.Bound=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.Bound.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){}; 
    a.value=0; 
    a.proxyId=0; 
    a.stabbingCount=0; 
    a.IsLower=function(){
	return(this.value&1)==0
    }; 
    a.IsUpper=function(){
	return(this.value&1)==1
    }; 
    a.Swap=function(b){
	var c=this.value,d=this.proxyId,e=this.stabbingCount; 
	this.value=b.value; 
	this.proxyId=b.proxyId; 
	this.stabbingCount=b.stabbingCount; 
	b.value=c; 
	b.proxyId=d; 
	b.stabbingCount=e
    }; 
    b2.Mat22=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.Mat22.prototype; 
    a.__constructor=function(b,c,d){
	if(c!=null&&d!=null){
	    this.col1.SetV(c); 
	    this.col2.SetV(d)
	}else{
	    c=Math.cos(b); 
	    b=Math.sin(b); 
	    this.col1.x=c; 
	    this.col2.x=-b; 
	    this.col1.y=b; 
	    this.col2.y=c
	}
    }; 
    a.__varz=function(){
	this.col1=new b2.Vec2; 
	this.col2=new b2.Vec2
    }; 
    a.col1=new b2.Vec2; 
    a.col2=new b2.Vec2; 
    a.Set=function(b){
	var c=Math.cos(b); 
	b=Math.sin(b); 
	this.col1.x=c; 
	this.col2.x=-b; 
	this.col1.y=b; 
	this.col2.y=c
    }; 

    a.SetVV=function(b,c){
	this.col1.SetV(b); 
	this.col2.SetV(c)
    }; 
    a.Copy=function(){
	return new b2.Mat22(0,this.col1,this.col2)
    }; 
    a.SetM=function(b){
	this.col1.SetV(b.col1); 
	this.col2.SetV(b.col2)
    }; 
    a.AddM=function(b){
	this.col1.x+=b.col1.x; 
	this.col1.y+=b.col1.y; 
	this.col2.x+=b.col2.x; 
	this.col2.y+=b.col2.y
    }; 
    a.SetIdentity=function(){
	this.col1.x=1; 
	this.col2.x=0; 
	this.col1.y=0; 
	this.col2.y=1
    }; 
    a.SetZero=function(){
	this.col1.x=0; 
	this.col2.x=0; 
	this.col1.y=0; 
	this.col2.y=0
    }; 

    a.GetAngle=function(){
	return Math.atan2(this.col1.y,this.col1.x)
    }; 
    a.Invert=function(b){
	var c=this.col1.x,d=this.col2.x,e=this.col1.y,f=this.col2.y,g=c*f-d*e; 
	g=1/g; 
	b.col1.x=g*f; 
	b.col2.x=-g*d; 
	b.col1.y=-g*e; 
	b.col2.y=g*c; 
	return b
    }; 
    a.Solve=function(b,c,d){
	var e=this.col1.x,f=this.col2.x,g=this.col1.y,h=this.col2.y,i=e*h-f*g; 
	i=1/i; 
	b.x=i*(h*c-f*d); 
	b.y=i*(e*d-g*c); 
	return b
    }; 
    a.Abs=function(){
	this.col1.Abs(); 
	this.col2.Abs()
    }; 
    b2.BoundaryListener=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.BoundaryListener.prototype.__constructor=function(){}; 
    b2.BoundaryListener.prototype.__varz=function(){}; 
    b2.BoundaryListener.prototype.Violation=function(){}; 
    b2.MassData=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.MassData.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){
	this.center=new b2.Vec2(0,0)
    }; 
    a.mass=0; 
    a.center=new b2.Vec2(0,0); 
    a.I=0; 
    b2.JointEdge=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.JointEdge.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){}; 
    a.other=null; 
    a.joint=null; 
    a.prev=null; 
    a.next=null; 
    b2.Collision=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.Collision.prototype.__constructor=function(){}; 
    b2.Collision.prototype.__varz=function(){}; 
    b2.Collision.nullFeature=255;
    b2.Collision.CollidePolyTempVec=new b2.Vec2; 

    b2.Collision.ClipSegmentToLine=function(b,c,d,e){
	var f,g=0; 
	f=c[0]; 
	var h=f.v; 
	f=c[1]; 
	var i=f.v,j=b2.Math.Dot(d,h)-e; 
	f=b2.Math.Dot(d,i)-e; 
	if(j<=0)b[g++]=c[0]; 
	if(f<=0)b[g++]=c[1]; 
	if(j*f<0){
	    d=j/(j-f); 
	    f=b[g]; 
	    f=f.v; 
	    f.x=h.x+d*(i.x-h.x); 
	    f.y=h.y+d*(i.y-h.y); 
	    f=b[g]; 
	    f.id=(j>0?c[0]:c[1]).id; 
	    ++g
	}
	return g
    }; 

    b2.Collision.EdgeSeparation=function(b,c,d,e,f){
	var g=b.m_vertices; 
	b=b.m_normals; 
	var h=e.m_vertexCount,i=e.m_vertices,j,k; 
	j=c.R; 
	k=b[d]; 
	b=j.col1.x*k.x+j.col2.x*k.y; 
	e=j.col1.y*k.x+j.col2.y*k.y; 
	j=f.R; 
	var l=j.col1.x*b+j.col1.y*e; 
	j=j.col2.x*b+j.col2.y*e; 
	for(var m=0,n=Number.MAX_VALUE,o=0; o<h; ++o){
	    k=i[o]; 
	    k=k.x*l+k.y*j; 
	    if(k<n){
		n=k; 
		m=o
	    }
	}
	k=g[d]; 
	j=c.R; 
	d=c.position.x+(j.col1.x*k.x+j.col2.x*k.y); 
	c=c.position.y+(j.col1.y*k.x+j.col2.y*k.y); 
	k=i[m]; 
	j=f.R; 
	g=f.position.x+(j.col1.x*k.x+j.col2.x*k.y); 
	f=f.position.y+(j.col1.y*k.x+j.col2.y*k.y); 
	g-=d; 
	f-=c; 
	return g*b+f*e
    }; 

    b2.Collision.FindMaxSeparation=function(b,c,d,e,f){
	var g=c.m_vertexCount,h=c.m_normals,i,j; 
	j=f.R; 
	i=e.m_centroid; 
	var k=f.position.x+(j.col1.x*i.x+j.col2.x*i.y),l=f.position.y+(j.col1.y*i.x+j.col2.y*i.y); 
	j=d.R; 
	i=c.m_centroid; 
	k-=d.position.x+(j.col1.x*i.x+j.col2.x*i.y); 
	l-=d.position.y+(j.col1.y*i.x+j.col2.y*i.y); 
	j=k*d.R.col1.x+l*d.R.col1.y; 
	l=k*d.R.col2.x+l*d.R.col2.y; 
	k=0; 
	for(var m=-Number.MAX_VALUE,n=0; n<g; ++n){
	    i=h[n]; 
	    i=i.x*j+i.y*l; 
	    if(i>m){
		m=i; 
		k=n
	    }
	}
	h=b2.Collision.EdgeSeparation(c,d,k,e,f); 
	if(h>0)
	    return h; 
	
	l=k-1>=0?k-1:g-1; 
	m=b2.Collision.EdgeSeparation(c,d,l,e,f); 
	if(m>0)
	    return m; 
	n=k+1<g?k+1:0; 
	var o=b2.Collision.EdgeSeparation(c,d,n,e,f); 
	if(o>0)
	    return o; 
	j=i=0; 
	if(m>h&&m>o){
	    j=-1; 
	    i=l; 
	    l=m
	}else if(o>h){
	    j=1; 
	    i=n; 
	    l=o
	}else{
	    b[0]=k; 
	    return h
	}for(;;){
	    k=j==-1?i-1>=0?i-1:g-1:i+1<g?i+1:0; 
	    h=b2.Collision.EdgeSeparation(c,d,k,e,f); 
	    if(h>0)
		return h; 
	    if(h>l){
		i=k; 
		l=h
	    }else break
	}
	b[0]=i; 
	return l
    }; 

    b2.Collision.FindIncidentEdge=function(b,c,d,e,f,g){
	var h=c.m_normals,i=f.m_vertexCount; 
	c=f.m_vertices; 
	f=f.m_normals; 
	var j; 
	j=d.R; 
	d=h[e]; 
	h=j.col1.x*d.x+j.col2.x*d.y; 
	var k=j.col1.y*d.x+j.col2.y*d.y; 
	j=g.R; 
	d=j.col1.x*h+j.col1.y*k; 
	k=j.col2.x*h+j.col2.y*k; 
	h=d; 
	j=0;
	for(var l=Number.MAX_VALUE,m=0; m<i; ++m){
	    d=f[m]; 
	    d=h*d.x+k*d.y; 
	    if(d<l){
		l=d; 
		j=m
	    }
	}
	f=j; 
	h=f+1<i?f+1:0; 
	i=b[0]; 
	d=c[f]; 
	j=g.R; 
	i.v.x=g.position.x+(j.col1.x*d.x+j.col2.x*d.y); 
	i.v.y=g.position.y+(j.col1.y*d.x+j.col2.y*d.y); 
	i.id.features.referenceEdge=e; 
	i.id.features.incidentEdge=f; 
	i.id.features.incidentVertex=0; 
	i=b[1];
	d=c[h];
	j=g.R;
	i.v.x=g.position.x+(j.col1.x*d.x+j.col2.x*d.y); 
	i.v.y=g.position.y+(j.col1.y*d.x+j.col2.y*d.y); 
	i.id.features.referenceEdge=e; 
	i.id.features.incidentEdge=h; 
	i.id.features.incidentVertex=1
    }; 

    b2.Collision.CollidePolygons=function(b,c,d,e,f){
	var g=b.pointCount=0,h=[g],i=b2.Collision.FindMaxSeparation(h,c,d,e,f); 
	g=h[0]; 
	if(!(i>0)){
	    var j=0; 
	    h=[j]; 
	    var k=b2.Collision.FindMaxSeparation(h,e,f,c,d); 
	    j=h[0]; 
	    if(!(k>0)){
		var l=new b2.XForm,m=new b2.XForm,n=0; 
		h=0; 
		if(k>0.98*i+0.001){
		    i=e; 
		    e=c; 
		    l.Set(f); 
		    m.Set(d); 
		    n=j; 
		    h=1
		}else{
		    i=c; 
		    e=e; 
		    l.Set(d); 
		    m.Set(f); 
		    n=g; 
		    h=0
		}
		c=[new ClipVertex,new ClipVertex]; 
		b2.Collision.FindIncidentEdge(c,i,l,n,e,m); 
		g=i.m_vertexCount; 
		m=i.m_vertices; 
		i=m[n]; 
		e=i.Copy(); 
		if(n+1<g){
		    i=m[parseInt(n+1)]; 
		    i=i.Copy()
		}else{
		    i=m[0]; 
		    i=i.Copy()
		}
		b2.Math.SubtractVV(i,e); 
		g=b2.Math.MulMV(l.R,b2.Math.SubtractVV(i,e)); 
		g.Normalize(); 
		n=b2.Math.CrossVF(g,1); 
		e=b2.Math.MulX(l,e); 
		i=b2.Math.MulX(l,i); 
		l=b2.Math.Dot(n,e); 
		m=-b2.Math.Dot(g,e); 
		i=b2.Math.Dot(g,i); 
		j=[new ClipVertex,new ClipVertex]; 
		e=[new ClipVertex,new ClipVertex]; 
		k=0; 
		k=b2.Collision.ClipSegmentToLine(j,c,g.Negative(),m); 
		if(!(k<2)){
		    k=b2.Collision.ClipSegmentToLine(e,j,g,i); 
		    if(!(k<2)){
			b.normal=h?n.Negative():n.Copy(); 
			for(m=g=0; m<b2.Settings.maxManifoldPoints; ++m){
			    c=e[m]; 
			    i=b2.Math.Dot(n,c.v)-l; 
			    if(i<=0){
				j=b.points[g]; 
				j.separation=i; 
				j.localPoint1=b2.Math.MulXT(d,c.v); 
				j.localPoint2=b2.Math.MulXT(f,c.v); 
				j.id.key=c.id._key; 
				j.id.features.flip=h; 
				++g
			    }
			}
			b.pointCount=g
		    }
		}
	    }
	}
    }; 

    b2.Collision.CollideCircles=function(b,c,d,e,f){
	b.pointCount=0; 
	var g,h; 
	g=d.R; 
	h=c.m_localPosition; 
	var i=d.position.x+(g.col1.x*h.x+g.col2.x*h.y),j=d.position.y+(g.col1.y*h.x+g.col2.y*h.y); 
	g=f.R; 
	h=e.m_localPosition; 
	var k=f.position.x+(g.col1.x*h.x+g.col2.x*h.y); 
	g=f.position.y+(g.col1.y*h.x+g.col2.y*h.y); 
	h=k-i; 
	var l=g-j,m=h*h+l*l; 
	c=c.m_radius; 
	e=e.m_radius; 
	var n=c+e; 
	if(!(m>n*n)){
	    if(m<Number.MIN_VALUE){
		m=-n; 
		b.normal.Set(0,1)
	    }else{
		var o=Math.sqrt(m); 
		m=o-n; 
		n=1/o; 
		b.normal.x=n*h; 
		b.normal.y=n*l
	    }
	    b.pointCount=1; 
	    h=b.points[0]; 
	    h.id.key=0; 
	    h.separation=m; 
	    i+=c*b.normal.x; 
	    j+=c*b.normal.y; 
	    k-=e*b.normal.x; 
	    g-=e*b.normal.y; 
	    b=0.5*(i+k); 
	    j=0.5*(j+g); 
	    i=b-d.position.x; 
	    k=j-d.position.y; 
	    h.localPoint1.x=i*d.R.col1.x+k*d.R.col1.y; 
	    h.localPoint1.y=i*d.R.col2.x+k*d.R.col2.y; 
	    i=b-f.position.x; 
	    k=j-f.position.y; 
	    h.localPoint2.x=i*f.R.col1.x+k*f.R.col1.y; 
	    h.localPoint2.y=i*f.R.col2.x+k*f.R.col2.y
	}
    }; 

    b2.Collision.CollidePolygonAndCircle=function(b,c,d,e,f){
	b.pointCount=0; 
	var g,h,i,j,k,l; 
	l=f.R; 
	k=e.m_localPosition; 
	j=f.position.x+(l.col1.x*k.x+l.col2.x*k.y); 
	var m=f.position.y+(l.col1.y*k.x+l.col2.y*k.y); 
	h=j-d.position.x; 
	i=m-d.position.y; 
	l=d.R; 
	var n=h*l.col1.x+i*l.col1.y; 
	l=h*l.col2.x+i*l.col2.y; 
	var o=0,q=-Number.MAX_VALUE; 
	e=e.m_radius; 
	var r=c.m_vertexCount; 
	g=c.m_vertices; 
	c=c.m_normals; 
	for(var s=0; s<r; ++s){
	    k=g[s]; 
	    h=n-k.x; 
	    i=l-k.y; 
	    k=c[s]; 
	    h=k.x*h+k.y*i; 
	    if(h>e)
		return; 
	    if(h>q){
		q=h; 
		o=s
	    }
	}if(q<Number.MIN_VALUE){
	    b.pointCount=1; 
	    k=c[o]; 
	    l=d.R; 
	    b.normal.x=l.col1.x*k.x+l.col2.x*k.y; 
	    b.normal.y=l.col1.y*k.x+l.col2.y*k.y; 
	    g=b.points[0]; 
	    g.id.features.incidentEdge=o; 
	    g.id.features.incidentVertex=b2.Collision.nullFeature; 
	    g.id.features.referenceEdge=0; 
	    g.id.features.flip=0; 
	    j=j-e*b.normal.x; 
	    b=m-e*b.normal.y; 
	    h=j-d.position.x; 
	    i=b-d.position.y; 
	    l=d.R; 
	    g.localPoint1.x=h*l.col1.x+i*l.col1.y; 
	    g.localPoint1.y=h*l.col2.x+i*l.col2.y; 
	    h=j-f.position.x; 
	    i=b-f.position.y; 
	    l=f.R; 
	    g.localPoint2.x=h*l.col1.x+i*l.col1.y; 
	    g.localPoint2.y=h*l.col2.x+i*l.col2.y; 
	    
	    g.separation=q-e
	}else{
	    q=o; 
	    r=q+1<r?q+1:0; 
	    k=g[q]; 
	    c=g[r]; 
	    var v=c.x-k.x; 
	    s=c.y-k.y; 
	    var z=Math.sqrt(v*v+s*s); 
	    v/=z; 
	    s/=z; 
	    h=n-k.x; 
	    i=l-k.y; 
	    h=h*v+i*s; 
	    g=b.points[0]; 
	    if(h<=0){
		i=k.x; 
		k=k.y; 
		g.id.features.incidentEdge=b2.Collision.nullFeature; 
		g.id.features.incidentVertex=q
	    }else if(h>=z){
		i=c.x; 
		k=c.y; 
		g.id.features.incidentEdge=b2.Collision.nullFeature; 
		g.id.features.incidentVertex=r}else{
		    i=v*h+k.x; 
		    k=s*h+k.y; 
		    g.id.features.incidentEdge=o; 
		    g.id.features.incidentVertex=0}h=n-i; 
	    i=l-k; 
	    n=Math.sqrt(h*h+i*i); 
	    h/=n; 
	    i/=n; 
	    if(!(n>e)){
		b.pointCount=1; 
		l=d.R; 
		b.normal.x=l.col1.x*h+l.col2.x*i; 
		b.normal.y=l.col1.y*h+l.col2.y*i; 
		j=j-e*b.normal.x; 
		b=m-e*b.normal.y; 
		h=j-d.position.x; 
		i=b-d.position.y; 
		l=d.R; 
		g.localPoint1.x=h*l.col1.x+i*l.col1.y; 
		g.localPoint1.y=h*l.col2.x+i*l.col2.y; 
		h=j-f.position.x; 
		i=b-f.position.y; 
		l=f.R; 
		g.localPoint2.x=h*l.col1.x+i*l.col1.y; 
		g.localPoint2.y=h*l.col2.x+i*l.col2.y; 
		g.separation=n-e; 
		g.id.features.referenceEdge=0; 
		g.id.features.flip=0
	    }
	}
    }; 

    b2.Collision.TestOverlap=function(b,c){
	var d=c.lowerBound,e=b.upperBound,f=d.x-e.x,g=d.y-e.y; 
	d=b.lowerBound; 
	e=c.upperBound; 
	b=d.y-e.y; 
	if(f>0||g>0)
	    return false; 
	if(d.x-e.x>0||b>0)
	    return false; 
	return true
    }; 
    b2.ContactListener=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactListener.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){}; 
    a.Add=function(){}; 
    a.Persist=function(){}; 
    a.Remove=function(){}; 
    a.Result=function(){}; 
    b2.PairCallback=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.PairCallback.prototype.__constructor=function(){}; 
    b2.PairCallback.prototype.__varz=function(){}; 
    b2.PairCallback.prototype.PairAdded=function(){
	return null
    }; 
    b2.PairCallback.prototype.PairRemoved=function(){}; 
    b2.JointDef=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.JointDef.prototype; 
    a.__constructor=function(){
	this.type=b2.Joint.e_unknownJoint; 
	this.body2=this.body1=this.userData=null; 
	this.collideConnected=false
    }; 
    a.__varz=function(){}; 
    a.type=0; 
    a.userData=null; 
    a.body1=null; 
    a.body2=null; 
    a.collideConnected=null; 
    b2.Proxy=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.Proxy.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){
	this.lowerBounds=[parseInt(0),parseInt(0)]; 
	this.upperBounds=[parseInt(0),parseInt(0)]
    }; 
    a.lowerBounds=[parseInt(0),parseInt(0)]; 
    a.upperBounds=[parseInt(0),parseInt(0)]; 
    a.overlapCount=0; 
    a.timeStamp=0; 
    a.userData=null; 
    a.GetNext=function(){
	return this.lowerBounds[0]
    }; 
    a.SetNext=function(b){
	this.lowerBounds[0]=b%65535
    }; 

    a.IsValid=function(){
	return this.overlapCount!=b2.BroadPhase.invalid
    }; 
    b2.Color=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.Color.prototype; 
    a.__constructor=function(b,c,d){
	this._r=parseInt(255*b2.Math.Clamp(b,0,1)); 
	this._g=parseInt(255*b2.Math.Clamp(c,0,1)); 
	this._b=parseInt(255*b2.Math.Clamp(d,0,1))
    }; 
    a.__varz=function(){}; 
    a._r=0; 
    a._g=0; 
    a._b=0; 
    a.Set=function(b,c,d){
	this._r=parseInt(255*b2.Math.Clamp(b,0,1)); 
	this._g=parseInt(255*b2.Math.Clamp(c,0,1)); 
	this._b=parseInt(255*b2.Math.Clamp(d,0,1))
    }; 

    a.set=function(b){
	this._r=parseInt(255*b2.Math.Clamp(b,0,1))
    }; 
    a.set=function(b){
	this._g=parseInt(255*b2.Math.Clamp(b,0,1))
    }; 
    a.set=function(b){
	this._b=parseInt(255*b2.Math.Clamp(b,0,1))
    }; 
    a.get=function(){
	return this._r|this._g<<8|this._b<<16
    }; 
    b2.FilterData=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.FilterData.prototype; 
    a.__constructor=function(){}; 
    a.__varz=function(){
	this.categoryBits=1; 
	this.maskBits=65535
    }; 
    a.categoryBits=1; 
    a.maskBits=65535; 
    a.groupIndex=0; 
    a.Copy=function(){
	var b=new b2.FilterData; 
	b.categoryBits=this.categoryBits; 
	b.maskBits=this.maskBits; 
	b.groupIndex=this.groupIndex; 
	return b
    }; 
    b2.PairManager=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    b2.PairManager.prototype.__constructor=function(){
	var b=0; 
	this.m_hashTable=new Array(b2.Pair.tableCapacity); 
	for(b=0; b<b2.Pair.tableCapacity; ++b)
	    this.m_hashTable[b]=b2.Pair.nullPair; 
	this.m_pairs=new Array(b2.Settings.maxPairs); 
	for(b=0; b<b2.Settings.maxPairs; ++b)
	    this.m_pairs[b]=new b2.Pair; 
	this.m_pairBuffer=new Array(b2.Settings.maxPairs); 
	for(b=0; b<b2.Settings.maxPairs;++b)
	    this.m_pairBuffer[b]=new b2.BufferedPair; 
	for(b=0; b<b2.Settings.maxPairs; ++b){
	    this.m_pairs[b].proxyId1=b2.Pair.nullProxy; 
	    this.m_pairs[b].proxyId2=b2.Pair.nullProxy; 
	    this.m_pairs[b].userData=null; 
	    this.m_pairs[b].status=0; 
	    this.m_pairs[b].next=b+1
	}
	this.m_pairs[parseInt(b2.Settings.maxPairs-1)].next=b2.Pair.nullPair; 
	this.m_pairBufferCount=this.m_pairCount=0
    }; 
    b2.PairManager.prototype.__varz=function(){
	
    }; 
    b2.PairManager.Hash=function(b,c){
	b=c<<16&4294901760|b; 
	b=~b+(b<<15&4294934528); 
	b^=b>>12&1048575; 
	b+=b<<2&4294967292; 
	b^=b>>4&268435455; 
	b*=2057; 
	b^=(b>>16)%65535; 
	return b
    }; 

    b2.PairManager.Equals=function(b,c,d){
	return b.proxyId1==c&&b.proxyId2==d
    }; 
    b2.PairManager.EqualsPair=function(b,c){
	return b.proxyId1==c.proxyId1&&b.proxyId2==c.proxyId2
    }; 
    a=b2.PairManager.prototype; 
    a.m_broadPhase=null; 
    a.m_callback=null; 
    a.m_pairs=null; 
    a.m_freePair=0; 
    a.m_pairCount=0; 
    a.m_pairBuffer=null; 
    a.m_pairBufferCount=0; 
    a.m_hashTable=null; 

    a.AddPair=function(b,c){
	if(b>c){
	    var d=b; 
	    b=c; 
	    c=d
	}
	d=b2.PairManager.Hash(b,c)&b2.Pair.tableMask; 
	var e=e=this.FindHash(b,c,d); 
	if(e!=null)
	    return e; 
	var f=this.m_freePair; 
	e=this.m_pairs[f]; 
	this.m_freePair=e.next; 
	e.proxyId1=b; 
	e.proxyId2=c; 
	e.status=0; 
	e.userData=null; 
	e.next=this.m_hashTable[d]; 
	this.m_hashTable[d]=f; 
	++this.m_pairCount; 
	return e
    }; 

    a.RemovePair=function(b,c){
	if(b>c){
	    var d=b; 
	    b=c; 
	    c=d
	}
	d=b2.PairManager.Hash(b,c)&b2.Pair.tableMask; 
	for(var e=this.m_hashTable[d],f=null; e!=b2.Pair.nullPair;){
	    if(b2.PairManager.Equals(this.m_pairs[e],b,c)){
	       b=e; 
	       c=this.m_pairs[e]; 
	       if(f)f.next=c.next; 
	       else this.m_hashTable[d]=c.next; 
	       c=this.m_pairs[b]; 
	       d=c.userData; 
	       c.next=this.m_freePair; 
	       c.proxyId1=b2.Pair.nullProxy; 
	       c.proxyId2=b2.Pair.nullProxy; 
	       c.userData=null; 
	       c.status=0; 
	       this.m_freePair=b; 
	       --this.m_pairCount; 
	       return d
	    }else{
		f=this.m_pairs[e]; 
		e=f.next
	    }
	}
	return null
    }; 

    a.Find=function(b,c){
	if(b>c){
	    var d=b; 
	    b=c; 
	    c=d
	}
	d=b2.PairManager.Hash(b,c)&b2.Pair.tableMask; 
	return this.FindHash(b,c,d)
    }; 
    a.FindHash=function(b,c,d){
	var e=this.m_hashTable[d]; 
	for(d=this.m_pairs[e]; e!=b2.Pair.nullPair&&b2.PairManager.Equals(d,b,c)==false;){
	    e=d.next; 
	    d=this.m_pairs[e]}if(e==b2.Pair.nullPair)return null; 
	return d
    }; 
    a.ValidateBuffer=function(){
	
    }; 
    a.ValidateTable=function(){
	
    }; 
    a.Initialize=function(b,c){
	this.m_broadPhase=b; 
	this.m_callback=c
    }; 

    a.AddBufferedPair=function(b,c){
	c=this.AddPair(b,c); 
	if(c.IsBuffered()==false){
	    c.SetBuffered(); 
	    b=this.m_pairBuffer[this.m_pairBufferCount]; 
	    b.proxyId1=c.proxyId1; 
	    b.proxyId2=c.proxyId2; 
	    ++this.m_pairBufferCount}c.ClearRemoved(); 
	b2.BroadPhase.s_validate&&this.ValidateBuffer()
    }; 

    a.RemoveBufferedPair=function(b,c){
	c=this.Find(b,c); 
	if(c!=null){
	    if(c.IsBuffered()==false){
		c.SetBuffered(); 
		b=this.m_pairBuffer[this.m_pairBufferCount]; 
		b.proxyId1=c.proxyId1; 
		b.proxyId2=c.proxyId2; 
		++this.m_pairBufferCount}c.SetRemoved(); 
	    b2.BroadPhase.s_validate&&this.ValidateBuffer()}
    }; 

    a.Commit=function(){
	var b,c=0,d=0,e=this.m_broadPhase.m_proxyPool; 
	for(c=0; 
	    c<this.m_pairBufferCount; 
	    ++c){
	    b=this.m_pairBuffer[c]; 
	    var f=this.Find(b.proxyId1,b.proxyId2); 
	    f.ClearBuffered(); 
	    b=e[f.proxyId1]; 
	    var g=e[f.proxyId2]; 
	    if(f.IsRemoved()){
		f.IsFinal()==true&&this.m_callback.PairRemoved(b.userData,g.userData,f.userData); 
		b=this.m_pairBuffer[d]; 
		b.proxyId1=f.proxyId1; 
		b.proxyId2=f.proxyId2; 
		++d}else if(f.IsFinal()==false){
		    f.userData=this.m_callback.PairAdded(b.userData,g.userData); 
		    f.SetFinal()}}for(c=0; 
				      c<
				      d; 
				      ++c){
			b=this.m_pairBuffer[c]; 
			this.RemovePair(b.proxyId1,b.proxyId2)}this.m_pairBufferCount=0; 
	b2.BroadPhase.s_validate&&this.ValidateTable()
    }; 
    b2.ContactSolver=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactSolver.prototype; 

    a.__constructor=function(b,c,d,e){
	var f; 
	this.m_step.dt=b.dt; 
	this.m_step.inv_dt=b.inv_dt; 
	this.m_step.maxIterations=b.maxIterations; 
	this.m_allocator=e; 
	b=0; 
	var g; 
	for(b=this.m_constraintCount=0; b<d; ++b){
	    f=c[b]; 
	    this.m_constraintCount+=f.m_manifoldCount
	}
	for(b=0; b<this.m_constraintCount; b++)
	    this.m_constraints[b]=new b2.ContactConstraint; 
	for(b=e=0; b<d; ++b){
	    f=c[b]; 
	    var h=f.m_shape1.m_body,i=f.m_shape2.m_body,j=f.m_manifoldCount,k=f.GetManifolds(),l=f.m_friction; 
	    f=f.m_restitution; 
	    for(var m=h.m_linearVelocity.x,n=h.m_linearVelocity.y,o=i.m_linearVelocity.x,q=i.m_linearVelocity.y,r=h.m_angularVelocity,s=i.m_angularVelocity,v=0; v<j; ++v){
		var z=k[v],y=z.normal.x,t=z.normal.y,w=this.m_constraints[e]; 
		w.body1=h; 
		w.body2=i; 
		w.manifold=z; 
		w.normal.x=y; 
		w.normal.y=t; 
		w.pointCount=z.pointCount; 
		w.friction=l; 
		w.restitution=f; 
		for(var A=0; A<w.pointCount; ++A){
		    var u=z.points[A],x=w.points[A]; 
		    x.normalImpulse=u.normalImpulse; 
		    x.tangentImpulse=u.tangentImpulse; 
		    x.separation=u.separation; 
		    x.positionImpulse=0; 
		    x.localAnchor1.SetV(u.localPoint1); 
		    x.localAnchor2.SetV(u.localPoint2); 
		    var B; 
		    g=h.m_xf.R; 
		    var C=u.localPoint1.x-h.m_sweep.localCenter.x,E=u.localPoint1.y-h.m_sweep.localCenter.y; 
		    B=g.col1.x*C+g.col2.x*E; 
		    E=g.col1.y*C+g.col2.y*E; 
		    C=B; 
		    x.r1.Set(C,E); 
		    g=i.m_xf.R; 
		    var F=u.localPoint2.x-i.m_sweep.localCenter.x; 
		    u=u.localPoint2.y-i.m_sweep.localCenter.y; 
		    B=g.col1.x*F+g.col2.x*u; 
		    u=g.col1.y*F+g.col2.y*u; 
		    F=B; 
		    x.r2.Set(F,u); 
		    g=C*C+E*E; 
		    B=F*F+u*u; 
		    var H=C*y+E*t,D=F*y+u*t,G=h.m_invMass+i.m_invMass; 
		    G+=h.m_invI*(g-H*H)+i.m_invI*(B-D*D); 
		    x.normalMass=1/G; 
		    G=h.m_mass*h.m_invMass+i.m_mass*i.m_invMass; 
		    G+=h.m_mass*h.m_invI*(g-H*H)+i.m_mass*i.m_invI*(B-D*D); 
		    x.equalizedMass=1/G; 
		    D=-y; 
		    H=C*t+E*D; 
		    D=F*t+u*D; 
		    G=h.m_invMass+i.m_invMass; 
		    G+=h.m_invI*(g-H*H)+i.m_invI*(B-D*D); 
		    x.tangentMass=1/G; 
		    x.velocityBias=0; 
		    if(x.separation>0)
			x.velocityBias=-60*x.separation; 
		    B=o+-s*u-m- (-r*E); 
		    C=w.normal.x*B+w.normal.y*(q+s*F-n-r*C); 
		    if(C<-b2.Settings.velocityThreshold)
			x.velocityBias+=-w.restitution*C
		}
		++e
	    }
	}
    }; 
    a.__varz=function(){
	this.m_step=new b2.TimeStep; 
	this.m_constraints=[]
    }; 
    a.m_step=new b2.TimeStep; 

    a.m_allocator=null; 
    a.m_constraints=[]; 
    a.m_constraintCount=0; 

    a.InitVelocityConstraints=function(b){
	for(var c=0; 
	    c<this.m_constraintCount; 
	    ++c){
	    var d=this.m_constraints[c],e=d.body1,f=d.body2,g=e.m_invMass,h=e.m_invI,i=f.m_invMass,j=f.m_invI,k=d.normal.x,l=d.normal.y,m=-k,n=0,o=0; 
	    if(b.warmStarting){
		o=d.pointCount; 
		for(n=0; 
		    n<o; 
		    ++n){
		    var q=d.points[n]; 
		    q.normalImpulse*=b.dtRatio; 
		    q.tangentImpulse*=b.dtRatio; 
		    var r=q.normalImpulse*k+q.tangentImpulse*l,s=q.normalImpulse*l+q.tangentImpulse*m; 
		    e.m_angularVelocity-=h*(q.r1.x*s-q.r1.y*r); 
		    e.m_linearVelocity.x-=g*r; 
		    e.m_linearVelocity.y-=
			g*s; 
		    f.m_angularVelocity+=j*(q.r2.x*s-q.r2.y*r); 
		    f.m_linearVelocity.x+=i*r; 
		    f.m_linearVelocity.y+=i*s}}else{
			o=d.pointCount; 
			for(n=0; 
			    n<o; 
			    ++n){
			    e=d.points[n]; 
			    e.normalImpulse=0; 
			    e.tangentImpulse=0}}}
    }; 

    a.SolveVelocityConstraints=function(){
	for(var b=0,c,d,e,f,g,h,i=0; 
	    i<this.m_constraintCount; 
	    ++i){
	    var j=this.m_constraints[i],k=j.body1,l=j.body2,m=k.m_angularVelocity,n=l.m_angularVelocity,o=k.m_linearVelocity,q=l.m_linearVelocity,r=k.m_invMass,s=k.m_invI,v=l.m_invMass,z=l.m_invI,y=j.normal.x,t=j.normal.y,w=-y,A=j.friction,u=j.pointCount; 
	    for(b=0; 
		b<u; 
		++b){
		c=j.points[b]; 
		d=q.x+-n*c.r2.y-o.x- (-m*c.r1.y); 
		e=q.y+n*c.r2.x-o.y-m*c.r1.x; 
		f=d*y+e*t; 
		f=-c.normalMass*(f-c.velocityBias); 
		d=d*t+e*w; 
		e=c.tangentMass*-d; 

		d=b2.Math.Max(c.normalImpulse+f,0); 
		f=d-c.normalImpulse; 
		g=A*c.normalImpulse; 
		g=b2.Math.Clamp(c.tangentImpulse+e,-g,g); 
		e=g-c.tangentImpulse; 
		h=f*y+e*t; 
		f=f*t+e*w; 
		o.x-=r*h; 
		o.y-=r*f; 
		m-=s*(c.r1.x*f-c.r1.y*h); 
		q.x+=v*h; 
		q.y+=v*f; 
		n+=z*(c.r2.x*f-c.r2.y*h); 
		c.normalImpulse=d; 
		c.tangentImpulse=g}k.m_angularVelocity=m; 
	    l.m_angularVelocity=n}
    }; 

    a.FinalizeVelocityConstraints=function(){
	for(var b=0; 
	    b<this.m_constraintCount; 
	    ++b)for(var c=this.m_constraints[b],d=c.manifold,e=0; 
		    e<c.pointCount; 
		    ++e){
		var f=d.points[e],g=c.points[e]; 
		f.normalImpulse=g.normalImpulse; 
		f.tangentImpulse=g.tangentImpulse}
    }; 

    a.SolvePositionConstraints=function(b){
	for(var c=0,d,e,f=0; 
	    f<this.m_constraintCount; 
	    ++f)for(var g=this.m_constraints[f],h=g.body1,i=g.body2,j=h.m_sweep.c,k=h.m_sweep.a,l=i.m_sweep.c,m=i.m_sweep.a,n=h.m_mass*h.m_invMass,o=h.m_mass*h.m_invI,q=i.m_mass*i.m_invMass,r=i.m_mass*i.m_invI,s=g.normal.x,v=g.normal.y,z=g.pointCount,y=0; 
		    y<z; 
		    ++y){
		var t=g.points[y]; 
		d=h.m_xf.R; 
		e=h.m_sweep.localCenter; 
		var w=t.localAnchor1.x-e.x,A=t.localAnchor1.y-e.y; 
		x=d.col1.x*w+d.col2.x*A; 
		A=d.col1.y*w+d.col2.y*A; 
		w=x; 
		d=i.m_xf.R; 

		e=i.m_sweep.localCenter; 
		var u=t.localAnchor2.x-e.x; 
		e=t.localAnchor2.y-e.y; 
		var x=d.col1.x*u+d.col2.x*e; 
		e=d.col1.y*u+d.col2.y*e; 
		u=x; 
		d=(l.x+u-(j.x+w))*s+(l.y+e-(j.y+A))*v+t.separation; 
		c=b2.Math.Min(c,d); 
		d=b*b2.Math.Clamp(d+b2.Settings.linearSlop,-b2.Settings.maxLinearCorrection,0); 
		d=-t.equalizedMass*d; 
		x=t.positionImpulse; 
		t.positionImpulse=b2.Math.Max(x+d,0); 
		d=t.positionImpulse-x; 
		t=d*s; 
		d=d*v; 
		j.x-=n*t; 
		j.y-=n*d; 
		k-=o*(w*d-A*t); 
		h.m_sweep.a=k; 
		h.SynchronizeTransform(); 
		l.x+=q*t; 
		l.y+=q*d; 
		m+=r*(u*d-e*t); 

		i.m_sweep.a=m; 
		i.SynchronizeTransform()}return c>=-1.5*b2.Settings.linearSlop
    }; 
    b2.BoundValues=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.BoundValues.prototype.__constructor=function(){
	
    }; 
    b2.BoundValues.prototype.__varz=function(){
	this.lowerValues=[0,0]; 
	this.upperValues=[0,0]
    }; 
    b2.BoundValues.prototype.lowerValues=[0,0]; 
    b2.BoundValues.prototype.upperValues=[0,0]; 
    var Features=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    Features.prototype={
	referenceEdge:function(){
	    return this._referenceEdge},referenceEdge:function(b){
		this._referenceEdge=b; 
		this._m_id._key=this._m_id._key&4294967040|this._referenceEdge&255},incidentEdge:function(){
		    return this._incidentEdge},incidentEdge:function(b){
			this._incidentEdge=b; 
			this._m_id._key=this._m_id._key&4294902015|this._incidentEdge<<8&65280},incidentVertex:function(b){
			    this._incidentVertex=b; 
			    this._m_id._key=this._m_id._key&4278255615|this._incidentVertex<<16&16711680},incidentVertex:function(){
				return this._incidentVertex},
	flip:function(b){
	    this._flip=b; 
	    this._m_id._key=this._m_id._key&16777215|this._flip<<24&4278190080},flip:function(){
		return this._flip}
    }; 
    a=Features.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	
    }; 
    a._referenceEdge=0; 
    a._incidentEdge=0; 
    a._incidentVertex=0; 
    a._flip=0; 
    a._m_id=null; 
    b2.MouseJointDef=function(){
	b2.JointDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.MouseJointDef.prototype,b2.JointDef.prototype); 
    a=b2.MouseJointDef.prototype; 
    a._super=function(){
	b2.JointDef.prototype.__constructor.apply(this,arguments)
    }; 
    a.__constructor=function(){
	this.type=b2.Joint.e_mouseJoint; 
	this.maxForce=0; 
	this.frequencyHz=5; 
	this.dampingRatio=0.7; 
	this.timeStep=1/60
    }; 
    a.__varz=function(){
	this.target=new b2.Vec2
    }; 
    a.target=new b2.Vec2; 
    a.maxForce=null; 

    a.frequencyHz=null; 
    a.dampingRatio=null; 
    a.timeStep=null; 
    b2.ContactConstraintPoint=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactConstraintPoint.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.localAnchor1=new b2.Vec2; 
	this.localAnchor2=new b2.Vec2; 
	this.r1=new b2.Vec2; 
	this.r2=new b2.Vec2
    }; 
    a.localAnchor1=new b2.Vec2; 
    a.localAnchor2=new b2.Vec2; 
    a.r1=new b2.Vec2; 
    a.r2=new b2.Vec2; 
    a.normalImpulse=null; 
    a.tangentImpulse=null; 
    a.positionImpulse=null; 
    a.normalMass=null; 
    a.tangentMass=null; 
    a.equalizedMass=null; 
    a.separation=null; 

    a.velocityBias=null; 
    b2.ContactRegister=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactRegister.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	
    }; 
    a.createFcn=null; 
    a.destroyFcn=null; 
    a.primary=null; 
    b2.DestructionListener=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.DestructionListener.prototype.__constructor=function(){
	
    }; 
    b2.DestructionListener.prototype.__varz=function(){
	
    }; 
    b2.DestructionListener.prototype.SayGoodbyeJoint=function(){
	
    }; 
    b2.DestructionListener.prototype.SayGoodbyeShape=function(){
	
    }; 
    b2.PulleyJointDef=function(){
	b2.JointDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PulleyJointDef.prototype,b2.JointDef.prototype); 
    a=b2.PulleyJointDef.prototype; 
    a._super=function(){
	b2.JointDef.prototype.__constructor.apply(this,arguments)
    }; 

    a.__constructor=function(){
	this.type=b2.Joint.e_pulleyJoint; 
	this.groundAnchor1.Set(-1,1); 
	this.groundAnchor2.Set(1,1); 
	this.localAnchor1.Set(-1,0); 
	this.localAnchor2.Set(1,0); 
	this.maxLength2=this.length2=this.maxLength1=this.length1=0; 
	this.ratio=1; 
	this.collideConnected=true
    }; 
    a.__varz=function(){
	this.groundAnchor1=new b2.Vec2; 
	this.groundAnchor2=new b2.Vec2; 
	this.localAnchor1=new b2.Vec2; 
	this.localAnchor2=new b2.Vec2
    }; 
    a.groundAnchor1=new b2.Vec2; 
    a.groundAnchor2=new b2.Vec2; 
    a.localAnchor1=new b2.Vec2; 

    a.localAnchor2=new b2.Vec2; 
    a.length1=null; 
    a.maxLength1=null; 
    a.length2=null; 
    a.maxLength2=null; 
    a.ratio=null; 

    a.Initialize=function(b,c,d,e,f,g,h){
	this.body1=b; 
	this.body2=c; 
	this.groundAnchor1.SetV(d); 
	this.groundAnchor2.SetV(e); 
	this.localAnchor1=this.body1.GetLocalPoint(f); 
	this.localAnchor2=this.body2.GetLocalPoint(g); 
	b=f.x-d.x; 
	d=f.y-d.y; 
	this.length1=Math.sqrt(b*b+d*d); 
	d=g.x-e.x; 
	e=g.y-e.y; 
	this.length2=Math.sqrt(d*d+e*e); 
	this.ratio=h; 
	h=this.length1+this.ratio*this.length2; 
	this.maxLength1=h-this.ratio*b2.PulleyJoint.minPulleyLength; 
	this.maxLength2=(h-b2.PulleyJoint.minPulleyLength)/this.ratio
    }; 
    b2.Jacobian=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.Jacobian.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.linear1=new b2.Vec2; 
	this.linear2=new b2.Vec2
    }; 
    a.linear1=new b2.Vec2; 
    a.angular1=null; 
    a.linear2=new b2.Vec2; 
    a.angular2=null; 
    a.SetZero=function(){
	this.linear1.SetZero(); 
	this.angular1=0; 
	this.linear2.SetZero(); 
	this.angular2=0
    }; 
    a.Set=function(b,c,d,e){
	this.linear1.SetV(b); 
	this.angular1=c; 
	this.linear2.SetV(d); 
	this.angular2=e
    }; 

    a.Compute=function(b,c,d,e){
	return this.linear1.x*b.x+this.linear1.y*b.y+this.angular1*c+(this.linear2.x*d.x+this.linear2.y*d.y)+this.angular2*e
    }; 
    b2.DebugDraw=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.DebugDraw.prototype.__constructor=function(){
	this.m_drawFlags=0
    }; 
    b2.DebugDraw.prototype.__varz=function(){
	
    }; 
    b2.DebugDraw.e_shapeBit=1; 
    b2.DebugDraw.e_jointBit=2; 
    b2.DebugDraw.e_coreShapeBit=4; 
    b2.DebugDraw.e_aabbBit=8; 
    b2.DebugDraw.e_obbBit=16; 
    b2.DebugDraw.e_pairBit=32; 
    b2.DebugDraw.e_centerOfMassBit=64; 
    a=b2.DebugDraw.prototype; 
    a.m_drawFlags=0; 
    a.m_sprite=null; 
    a.m_drawScale=1; 
    a.m_lineThickness=1; 
    a.m_alpha=1; 
    a.m_fillAlpha=1; 

    a.m_xformScale=1; 
    a.SetFlags=function(b){
	this.m_drawFlags=b
    }; 
    a.GetFlags=function(){
	return this.m_drawFlags
    }; 
    a.AppendFlags=function(b){
	this.m_drawFlags|=b
    }; 
    a.ClearFlags=function(b){
	this.m_drawFlags&=~b
    }; 

    a.DrawPolygon=function(b,c,d){
	this.m_sprite.graphics.lineStyle(this.m_lineThickness,d,this.m_alpha); 
	this.m_sprite.graphics.moveTo(b[0].x*this.m_drawScale,b[0].y*this.m_drawScale); 
	for(d=1; 
	    d<c; 
	    d++)this.m_sprite.graphics.lineTo(b[d].x*this.m_drawScale,b[d].y*this.m_drawScale); 
	this.m_sprite.graphics.lineTo(b[0].x*this.m_drawScale,b[0].y*this.m_drawScale)
    }; 

    a.DrawSolidPolygon=function(b,c,d){
	this.m_sprite.graphics.lineStyle(this.m_lineThickness,d,this.m_alpha); 
	this.m_sprite.graphics.moveTo(b[0].x*this.m_drawScale,b[0].y*this.m_drawScale); 
	this.m_sprite.graphics.beginFill(d,this.m_fillAlpha); 
	for(d=1; 
	    d<c; 
	    d++)this.m_sprite.graphics.lineTo(b[d].x*this.m_drawScale,b[d].y*this.m_drawScale); 
	this.m_sprite.graphics.lineTo(b[0].x*this.m_drawScale,b[0].y*this.m_drawScale); 
	this.m_sprite.graphics.endFill()
    }; 

    a.DrawCircle=function(b,c,d){
	this.m_sprite.graphics.lineStyle(this.m_lineThickness,d,this.m_alpha); 
	this.m_sprite.graphics.drawCircle(b.x*this.m_drawScale,b.y*this.m_drawScale,c*this.m_drawScale)
    }; 

    a.DrawSolidCircle=function(b,c,d,e){
	this.m_sprite.graphics.lineStyle(this.m_lineThickness,e,this.m_alpha); 
	this.m_sprite.graphics.moveTo(0,0); 
	this.m_sprite.graphics.beginFill(e,this.m_fillAlpha); 
	this.m_sprite.graphics.drawCircle(b.x*this.m_drawScale,b.y*this.m_drawScale,c*this.m_drawScale); 
	this.m_sprite.graphics.endFill(); 
	this.m_sprite.graphics.moveTo(b.x*this.m_drawScale,b.y*this.m_drawScale); 
	this.m_sprite.graphics.lineTo((b.x+d.x*c)*this.m_drawScale,(b.y+d.y*c)*this.m_drawScale)
    }; 

    a.DrawSegment=function(b,c,d){
	this.m_sprite.graphics.lineStyle(this.m_lineThickness,d,this.m_alpha); 
	this.m_sprite.graphics.moveTo(b.x*this.m_drawScale,b.y*this.m_drawScale); 
	this.m_sprite.graphics.lineTo(c.x*this.m_drawScale,c.y*this.m_drawScale)
    }; 

    a.DrawXForm=function(b){
	this.m_sprite.graphics.lineStyle(this.m_lineThickness,16711680,this.m_alpha); 
	this.m_sprite.graphics.moveTo(b.position.x*this.m_drawScale,b.position.y*this.m_drawScale); 
	this.m_sprite.graphics.lineTo((b.position.x+this.m_xformScale*b.R.col1.x)*this.m_drawScale,(b.position.y+this.m_xformScale*b.R.col1.y)*this.m_drawScale); 
	this.m_sprite.graphics.lineStyle(this.m_lineThickness,65280,this.m_alpha); 
	this.m_sprite.graphics.moveTo(b.position.x*this.m_drawScale,b.position.y*this.m_drawScale); 

	this.m_sprite.graphics.lineTo((b.position.x+this.m_xformScale*b.R.col2.x)*this.m_drawScale,(b.position.y+this.m_xformScale*b.R.col2.y)*this.m_drawScale)
    }; 
    b2.ContactEdge=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactEdge.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	
    }; 
    a.other=null; 
    a.contact=null; 
    a.prev=null; 
    a.next=null; 
    b2.Sweep=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.Sweep.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.localCenter=new b2.Vec2; 
	this.c0=new b2.Vec2; 
	this.c=new b2.Vec2
    }; 
    a.localCenter=new b2.Vec2; 
    a.c0=new b2.Vec2; 
    a.c=new b2.Vec2; 
    a.a0=null; 
    a.a=null; 
    a.t0=null; 

    a.GetXForm=function(b,c){
	if(1-this.t0>Number.MIN_VALUE){
	    c=(c-this.t0)/(1-this.t0); 
	    b.position.x=(1-c)*this.c0.x+c*this.c.x; 
	    b.position.y=(1-c)*this.c0.y+c*this.c.y; 
	    b.R.Set((1-c)*this.a0+c*this.a)}else{
		b.position.SetV(this.c); 
		b.R.Set(this.a)}c=b.R; 
	b.position.x-=c.col1.x*this.localCenter.x+c.col2.x*this.localCenter.y; 
	b.position.y-=c.col1.y*this.localCenter.x+c.col2.y*this.localCenter.y
    }; 

    a.Advance=function(b){
	if(this.t0<b&&1-this.t0>Number.MIN_VALUE){
	    var c=(b-this.t0)/(1-this.t0); 
	    this.c0.x=(1-c)*this.c0.x+c*this.c.x; 
	    this.c0.y=(1-c)*this.c0.y+c*this.c.y; 
	    this.a0=(1-c)*this.a0+c*this.a; 
	    this.t0=b}
    }; 
    b2.ContactConstraint=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactConstraint.prototype; 
    a.__constructor=function(){
	this.points=new Array(b2.Settings.maxManifoldPoints); 
	for(var b=0; 
	    b<b2.Settings.maxManifoldPoints; 
	    b++)this.points[b]=new b2.ContactConstraintPoint
    }; 
    a.__varz=function(){
	this.normal=new b2.Vec2
    }; 
    a.points=null; 
    a.normal=new b2.Vec2; 
    a.manifold=null; 
    a.body1=null; 
    a.body2=null; 
    a.friction=null; 
    a.restitution=null; 
    a.pointCount=0; 
    b2.Distance=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.Distance.prototype.__constructor=function(){
	
    }; 
    b2.Distance.prototype.__varz=function(){
	
    }; 
    b2.Distance.g_GJK_Iterations=0; 
    b2.Distance.s_p1s=[new b2.Vec2,new b2.Vec2,new b2.Vec2]; 
    b2.Distance.s_p2s=[new b2.Vec2,new b2.Vec2,new b2.Vec2]; 
    b2.Distance.s_points=[new b2.Vec2,new b2.Vec2,new b2.Vec2]; 
    b2.Distance.gPoint=new b2.Point; 

    b2.Distance.ProcessTwo=function(b,c,d,e,f){
	var g=f[0]; 
	f=f[1]; 
	var h=d[0]; 
	d=d[1]; 
	var i=e[0]; 
	e=e[1]; 
	var j=-f.x,k=-f.y,l=g.x-f.x,m=g.y-f.y,n=Math.sqrt(l*l+m*m); 
	l/=n; 
	m/=n; 
	j=j*l+k*m; 
	if(j<=0||n<Number.MIN_VALUE){
	    b.SetV(d); 
	    c.SetV(e); 
	    h.SetV(d); 
	    i.SetV(e); 
	    g.SetV(f); 
	    return 1}j/=n; 
	b.x=d.x+j*(h.x-d.x); 
	b.y=d.y+j*(h.y-d.y); 
	c.x=e.x+j*(i.x-e.x); 
	c.y=e.y+j*(i.y-e.y); 
	return 2
    }; 

    b2.Distance.ProcessThree=function(b,c,d,e,f){
	var g=f[0],h=f[1],i=f[2]; 
	f=d[0]; 
	var j=d[1]; 
	d=d[2]; 
	var k=e[0],l=e[1]; 
	e=e[2]; 
	var m=g.x,n=g.y,o=h.x,q=h.y,r=i.x,s=i.y,v=o-m,z=q-n,y=r-m,t=s-n,w=r-o,A=s-q,u=-(m*y+n*t),x=r*y+s*t,B=-(o*w+q*A); 
	w=r*w+s*A; 
	if(x<=0&&w<=0){
	    b.SetV(d); 
	    c.SetV(e); 
	    f.SetV(d); 
	    k.SetV(e); 
	    g.SetV(i); 
	    return 1}z=v*t-z*y; 
	v=z*(m*q-n*o); 
	o=z*(o*s-q*r); 
	if(o<=0&&B>=0&&w>=0&&B+w>0){
	    u=B/(B+w); 
	    b.x=j.x+u*(d.x-j.x); 
	    b.y=j.y+u*(d.y-j.y); 
	    c.x=l.x+u*(e.x-l.x); 
	    c.y=l.y+u*(e.y-l.y); 
	    f.SetV(d); 
	    k.SetV(e); 
	    g.SetV(i); 

	    return 2}g=z*(r*n-s*m); 
	if(g<=0&&u>=0&&x>=0&&u+x>0){
	    u=u/(u+x); 
	    b.x=f.x+u*(d.x-f.x); 
	    b.y=f.y+u*(d.y-f.y); 
	    c.x=k.x+u*(e.x-k.x); 
	    c.y=k.y+u*(e.y-k.y); 
	    j.SetV(d); 
	    l.SetV(e); 
	    h.SetV(i); 
	    return 2}i=o+g+v; 
	i=1/i; 
	h=o*i; 
	g=g*i; 
	i=1-h-g; 
	b.x=h*f.x+g*j.x+i*d.x; 
	b.y=h*f.y+g*j.y+i*d.y; 
	c.x=h*k.x+g*l.x+i*e.x; 
	c.y=h*k.y+g*l.y+i*e.y; 
	return 3
    }; 

    b2.Distance.InPoints=function(b,c,d){
	for(var e=100*Number.MIN_VALUE,f=0; 
	    f<d; 
	    ++f){
	    var g=c[f],h=Math.abs(b.x-g.x),i=Math.abs(b.y-g.y),j=Math.max(Math.abs(b.x),Math.abs(g.x)); 
	    g=Math.max(Math.abs(b.y),Math.abs(g.y)); 
	    if(h<e*(j+1)&&i<e*(g+1))return true}return false
    }; 

    b2.Distance.DistanceGeneric=function(b,c,d,e,f,g){
	var h,i=b2.Distance.s_p1s,j=b2.Distance.s_p2s,k=b2.Distance.s_points,l=0; 
	b.SetV(d.GetFirstVertex(e)); 
	c.SetV(f.GetFirstVertex(g)); 
	for(var m=0,n=0; 
	    n<20; 
	    ++n){
	    h=c.x-b.x; 
	    var o=c.y-b.y,q=d.Support(e,h,o),r=f.Support(g,-h,-o); 
	    m=h*h+o*o; 
	    var s=r.x-q.x,v=r.y-q.y; 
	    if(m-(h*s+o*v)<=0.01*m){
		if(l==0){
		    b.SetV(q); 
		    c.SetV(r)}b2.Distance.g_GJK_Iterations=n; 
		return Math.sqrt(m)}switch(l){
		case 0:h=i[0]; 
		    h.SetV(q); 
		    h=j[0]; 
		    h.SetV(r); 
		    h=k[0]; 
		    h.x=s; 
		    h.y=v; 
		    b.SetV(i[0]); 
		    c.SetV(j[0]); 
		    ++l; 

		    break; 
		case 1:h=i[1]; 
		    h.SetV(q); 
		    h=j[1]; 
		    h.SetV(r); 
		    h=k[1]; 
		    h.x=s; 
		    h.y=v; 
		    l=b2.Distance.ProcessTwo(b,c,i,j,k); 
		    break; 
		case 2:h=i[2]; 
		    h.SetV(q); 
		    h=j[2]; 
		    h.SetV(r); 
		    h=k[2]; 
		    h.x=s; 
		    h.y=v; 
		    l=b2.Distance.ProcessThree(b,c,i,j,k); 
		    break}if(l==3){
			b2.Distance.g_GJK_Iterations=n; 
			return 0}q=-Number.MAX_VALUE; 
	    for(r=0; 
		r<l; 
		++r){
		h=k[r]; 
		q=b2.Math.Max(q,h.x*h.x+h.y*h.y)}if(l==3||m<=100*Number.MIN_VALUE*q){
		    b2.Distance.g_GJK_Iterations=n; 
		    h=c.x-b.x; 
		    o=c.y-b.y; 
		    m=h*h+o*o; 
		    return Math.sqrt(m)}}b2.Distance.g_GJK_Iterations=20; 
	return Math.sqrt(m)
    }; 

    b2.Distance.DistanceCC=function(b,c,d,e,f,g){
	var h,i; 
	h=e.R; 
	i=d.m_localPosition; 
	var j=e.position.x+(h.col1.x*i.x+h.col2.x*i.y); 
	e=e.position.y+(h.col1.y*i.x+h.col2.y*i.y); 
	h=g.R; 
	i=f.m_localPosition; 
	var k=g.position.x+(h.col1.x*i.x+h.col2.x*i.y); 
	g=g.position.y+(h.col1.y*i.x+h.col2.y*i.y); 
	h=k-j; 
	i=g-e; 
	var l=h*h+i*i; 
	d=d.m_radius-b2.Settings.toiSlop; 
	f=f.m_radius-b2.Settings.toiSlop; 
	var m=d+f; 
	if(l>m*m){
	    l=Math.sqrt(h*h+i*i); 
	    h/=l; 
	    i/=l; 
	    l=l-m; 
	    b.x=j+d*h; 
	    b.y=e+d*i; 
	    c.x=k-f*h; 
	    c.y=g-f*i; 
	    return l}else if(l>Number.MIN_VALUE*
			     Number.MIN_VALUE){
		l=Math.sqrt(h*h+i*i); 
		h/=l; 
		i/=l; 
		b.x=j+d*h; 
		b.y=e+d*i; 
		c.x=b.x; 
		c.y=b.y; 
		return 0}b.x=j; 
	b.y=e; 
	c.x=b.x; 
	c.y=b.y; 
	return 0
    }; 

    b2.Distance.DistancePC=function(b,c,d,e,f,g){
	var h,i,j=b2.Distance.gPoint; 
	i=f.m_localPosition; 
	h=g.R; 
	j.p.x=g.position.x+(h.col1.x*i.x+h.col2.x*i.y); 
	j.p.y=g.position.y+(h.col1.y*i.x+h.col2.y*i.y); 
	d=b2.Distance.DistanceGeneric(b,c,d,e,j,b2.Math.XForm_identity); 
	f=f.m_radius-b2.Settings.toiSlop; 
	if(d>f){
	    d-=f; 
	    e=c.x-b.x; 
	    b=c.y-b.y; 
	    g=Math.sqrt(e*e+b*b); 
	    e/=g; 
	    b/=g; 
	    c.x-=f*e; 
	    c.y-=f*b}else{
		d=0; 
		c.x=b.x; 
		c.y=b.y}return d
    }; 

    b2.Distance.Distance=function(b,c,d,e,f,g){
	var h=d.m_type,i=f.m_type; 
	if(h==b2.Shape.e_circleShape&&i==b2.Shape.e_circleShape)return b2.Distance.DistanceCC(b,c,d,e,f,g); 
	if(h==b2.Shape.e_polygonShape&&i==b2.Shape.e_circleShape)return b2.Distance.DistancePC(b,c,d,e,f,g); 
	if(h==b2.Shape.e_circleShape&&i==b2.Shape.e_polygonShape)return b2.Distance.DistancePC(c,b,f,g,d,e); 
	if(h==b2.Shape.e_polygonShape&&i==b2.Shape.e_polygonShape)return b2.Distance.DistanceGeneric(b,c,d,e,f,g); 
	return 0
    }; 
    b2.Shape=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.Shape.prototype.__constructor=function(b){
	this.m_userData=b.userData; 
	this.m_friction=b.friction; 
	this.m_restitution=b.restitution; 
	this.m_density=b.density; 
	this.m_body=null; 
	this.m_sweepRadius=0; 
	this.m_next=null; 
	this.m_proxyId=b2.Pair.nullProxy; 
	this.m_filter=b.filter.Copy(); 
	this.m_isSensor=b.isSensor
    }; 
    b2.Shape.prototype.__varz=function(){
	
    }; 
    b2.Shape.e_unknownShape=-1; 
    b2.Shape.e_circleShape=0; 
    b2.Shape.e_polygonShape=1; 

    b2.Shape.e_shapeTypeCount=2; 
    b2.Shape.e_hitCollide=1; 
    b2.Shape.e_missCollide=0; 
    b2.Shape.e_startsInsideCollide=-1; 
    b2.Shape.s_proxyAABB=new b2.AABB; 
    b2.Shape.s_syncAABB=new b2.AABB; 
    b2.Shape.s_resetAABB=new b2.AABB; 
    b2.Shape.Create=function(b){
	switch(b.type){
	case b2.Shape.e_circleShape:return new b2.CircleShape(b); 
	case b2.Shape.e_polygonShape:return new b2.PolygonShape(b); 
	default:return null}
    }; 
    b2.Shape.Destroy=function(){
	
    }; 
    a=b2.Shape.prototype; 
    a.m_type=0; 
    a.m_next=null; 
    a.m_body=null; 
    a.m_sweepRadius=null; 
    a.m_density=null; 

    a.m_friction=null; 
    a.m_restitution=null; 
    a.m_proxyId=0; 
    a.m_filter=null; 
    a.m_isSensor=null; 
    a.m_userData=null; 
    a.GetType=function(){
	return this.m_type
    }; 
    a.IsSensor=function(){
	return this.m_isSensor
    }; 
    a.SetFilterData=function(b){
	this.m_filter=b.Copy()
    }; 
    a.GetFilterData=function(){
	return this.m_filter.Copy()
    }; 
    a.GetBody=function(){
	return this.m_body
    }; 
    a.GetNext=function(){
	return this.m_next
    }; 
    a.GetUserData=function(){
	return this.m_userData
    }; 
    a.SetUserData=function(b){
	this.m_userData=b
    }; 
    a.TestPoint=function(){
	return false
    }; 

    a.TestSegment=function(){
	return b2.Shape.e_missCollide
    }; 
    a.ComputeAABB=function(){
	
    }; 
    a.ComputeSweptAABB=function(){
	
    }; 
    a.ComputeMass=function(){
	
    }; 
    a.GetSweepRadius=function(){
	return this.m_sweepRadius
    }; 
    a.GetFriction=function(){
	return this.m_friction
    }; 
    a.GetRestitution=function(){
	return this.m_restitution
    }; 
    a.CreateProxy=function(b,c){
	var d=b2.Shape.s_proxyAABB; 
	this.ComputeAABB(d,c); 
	this.m_proxyId=b.InRange(d)?b.CreateProxy(d,this):b2.Pair.nullProxy
    }; 

    a.DestroyProxy=function(b){
	if(this.m_proxyId!=b2.Pair.nullProxy){
	    b.DestroyProxy(this.m_proxyId); 
	    this.m_proxyId=b2.Pair.nullProxy}
    }; 
    a.Synchronize=function(b,c,d){
	if(this.m_proxyId==b2.Pair.nullProxy)return false; 
	var e=b2.Shape.s_syncAABB; 
	this.ComputeSweptAABB(e,c,d); 
	if(b.InRange(e)){
	    b.MoveProxy(this.m_proxyId,e); 
	    return true}else return false
    }; 

    a.RefilterProxy=function(b,c){
	if(this.m_proxyId!=b2.Pair.nullProxy){
	    b.DestroyProxy(this.m_proxyId); 
	    var d=b2.Shape.s_resetAABB; 
	    this.ComputeAABB(d,c); 
	    this.m_proxyId=b.InRange(d)?b.CreateProxy(d,this):b2.Pair.nullProxy}
    }; 
    a.UpdateSweepRadius=function(){
	
    }; 
    b2.XForm=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.XForm.prototype; 
    a.__constructor=function(b,c){
	if(b){
	    this.position.SetV(b); 
	    this.R.SetM(c)}
    }; 
    a.__varz=function(){
	this.position=new b2.Vec2; 
	this.R=new b2.Mat22
    }; 
    a.position=new b2.Vec2; 
    a.R=new b2.Mat22; 
    a.Initialize=function(b,c){
	this.position.SetV(b); 
	this.R.SetM(c)
    }; 
    a.SetIdentity=function(){
	this.position.SetZero(); 
	this.R.SetIdentity()
    }; 
    a.Set=function(b){
	this.position.SetV(b.position); 
	this.R.SetM(b.R)
    }; 
    b2.DistanceJointDef=function(){
	b2.JointDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.DistanceJointDef.prototype,b2.JointDef.prototype); 
    a=b2.DistanceJointDef.prototype; 
    a._super=function(){
	b2.JointDef.prototype.__constructor.apply(this,arguments)
    }; 
    a.__constructor=function(){
	this.type=b2.Joint.e_distanceJoint; 
	this.length=1; 
	this.dampingRatio=this.frequencyHz=0
    }; 
    a.__varz=function(){
	this.localAnchor1=new b2.Vec2; 
	this.localAnchor2=new b2.Vec2
    }; 

    a.localAnchor1=new b2.Vec2; 
    a.localAnchor2=new b2.Vec2; 
    a.length=null; 
    a.frequencyHz=null; 
    a.dampingRatio=null; 
    a.Initialize=function(b,c,d,e){
	this.body1=b; 
	this.body2=c; 
	this.localAnchor1.SetV(this.body1.GetLocalPoint(d)); 
	this.localAnchor2.SetV(this.body2.GetLocalPoint(e)); 
	b=e.x-d.x; 
	d=e.y-d.y; 
	this.length=Math.sqrt(b*b+d*d); 
	this.dampingRatio=this.frequencyHz=0
    }; 
    b2.OBB=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.OBB.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.R=new b2.Mat22; 
	this.center=new b2.Vec2; 
	this.extents=new b2.Vec2
    }; 
    a.R=new b2.Mat22; 
    a.center=new b2.Vec2; 
    a.extents=new b2.Vec2; 
    b2.BodyDef=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.BodyDef.prototype; 
    a.__constructor=function(){
	this.massData.center.SetZero(); 
	this.massData.mass=0; 
	this.massData.I=0; 
	this.userData=null; 
	this.position.Set(0,0); 
	this.angularDamping=this.linearDamping=this.angle=0; 
	this.allowSleep=true; 
	this.isBullet=this.fixedRotation=this.isSleeping=false
    }; 
    a.__varz=function(){
	this.massData=new b2.MassData; 
	this.position=new b2.Vec2
    }; 
    a.massData=new b2.MassData; 
    a.userData=null; 
    a.position=new b2.Vec2; 

    a.angle=null; 
    a.linearDamping=null; 
    a.angularDamping=null; 
    a.allowSleep=null; 
    a.isSleeping=null; 
    a.fixedRotation=null; 
    a.isBullet=null; 
    b2.PrismaticJointDef=function(){
	b2.JointDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PrismaticJointDef.prototype,b2.JointDef.prototype); 
    a=b2.PrismaticJointDef.prototype; 
    a._super=function(){
	b2.JointDef.prototype.__constructor.apply(this,arguments)
    }; 

    a.__constructor=function(){
	this.type=b2.Joint.e_prismaticJoint; 
	this.localAxis1.Set(1,0); 
	this.referenceAngle=0; 
	this.enableLimit=false; 
	this.upperTranslation=this.lowerTranslation=0; 
	this.enableMotor=false; 
	this.motorSpeed=this.maxMotorForce=0
    }; 
    a.__varz=function(){
	this.localAnchor1=new b2.Vec2; 
	this.localAnchor2=new b2.Vec2; 
	this.localAxis1=new b2.Vec2
    }; 
    a.localAnchor1=new b2.Vec2; 
    a.localAnchor2=new b2.Vec2; 
    a.localAxis1=new b2.Vec2; 
    a.referenceAngle=null; 
    a.enableLimit=null; 
    a.lowerTranslation=null; 

    a.upperTranslation=null; 
    a.enableMotor=null; 
    a.maxMotorForce=null; 
    a.motorSpeed=null; 
    a.Initialize=function(b,c,d,e){
	this.body1=b; 
	this.body2=c; 
	this.localAnchor1=this.body1.GetLocalPoint(d); 
	this.localAnchor2=this.body2.GetLocalPoint(d); 
	this.localAxis1=this.body1.GetLocalVector(e); 
	this.referenceAngle=this.body2.GetAngle()-this.body1.GetAngle()
    }; 
    b2.ContactID=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.ContactID.prototype={
	key:function(){
	    return this._key},key:function(b){
		this._key=b; 
		this.features._referenceEdge=this._key&255; 
		this.features._incidentEdge=(this._key&65280)>>8&255; 
		this.features._incidentVertex=(this._key&16711680)>>16&255; 
		this.features._flip=(this._key&4278190080)>>24&255}
    }; 
    a=b2.ContactID.prototype; 
    a.__constructor=function(){
	this.features._m_id=this
    }; 
    a.__varz=function(){
	this.features=new Features
    }; 

    a.features=new Features; 
    a._key=0; 
    a.Set=function(b){
	this.key=b._key
    }; 
    a.Copy=function(){
	var b=new b2.ContactID; 
	b.key=this._key; 
	return b
    }; 
    b2.RevoluteJointDef=function(){
	b2.JointDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.RevoluteJointDef.prototype,b2.JointDef.prototype); 
    a=b2.RevoluteJointDef.prototype; 
    a._super=function(){
	b2.JointDef.prototype.__constructor.apply(this,arguments)
    }; 

    a.__constructor=function(){
	this.type=b2.Joint.e_revoluteJoint; 
	this.localAnchor1.Set(0,0); 
	this.localAnchor2.Set(0,0); 
	this.motorSpeed=this.maxMotorTorque=this.upperAngle=this.lowerAngle=this.referenceAngle=0; 
	this.enableMotor=this.enableLimit=false
    }; 
    a.__varz=function(){
	this.localAnchor1=new b2.Vec2; 
	this.localAnchor2=new b2.Vec2
    }; 
    a.localAnchor1=new b2.Vec2; 
    a.localAnchor2=new b2.Vec2; 
    a.referenceAngle=null; 
    a.enableLimit=null; 
    a.lowerAngle=null; 
    a.upperAngle=null; 
    a.enableMotor=null; 
    a.motorSpeed=null; 

    a.maxMotorTorque=null; 
    a.Initialize=function(b,c,d){
	this.body1=b; 
	this.body2=c; 
	this.localAnchor1=this.body1.GetLocalPoint(d); 
	this.localAnchor2=this.body2.GetLocalPoint(d); 
	this.referenceAngle=this.body2.GetAngle()-this.body1.GetAngle()
    }; 
    b2.CircleShape=function(){
	b2.Shape.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.CircleShape.prototype,b2.Shape.prototype); 
    a=b2.CircleShape.prototype; 
    a._super=function(){
	b2.Shape.prototype.__constructor.apply(this,arguments)
    }; 
    a.__constructor=function(b){
	this._super(b); 
	this.m_type=b2.Shape.e_circleShape; 
	this.m_localPosition.SetV(b.localPosition); 
	this.m_radius=b.radius
    }; 
    a.__varz=function(){
	this.m_localPosition=new b2.Vec2
    }; 
    a.m_localPosition=new b2.Vec2; 

    a.m_radius=null; 
    a.TestPoint=function(b,c){
	var d=b.R,e=b.position.x+(d.col1.x*this.m_localPosition.x+d.col2.x*this.m_localPosition.y); 
	b=b.position.y+(d.col1.y*this.m_localPosition.x+d.col2.y*this.m_localPosition.y); 
	e=c.x-e; 
	b=c.y-b; 
	return e*e+b*b<=this.m_radius*this.m_radius
    }; 

    a.TestSegment=function(b,c,d,e,f){
	var g=b.R,h=e.p1.x-(b.position.x+(g.col1.x*this.m_localPosition.x+g.col2.x*this.m_localPosition.y)); 
	b=e.p1.y-(b.position.y+(g.col1.y*this.m_localPosition.x+g.col2.y*this.m_localPosition.y)); 
	var i=h*h+b*b-this.m_radius*this.m_radius; 
	if(i<0){
	    c[0]=0; 
	    return b2.Shape.e_startsInsideCollide}g=e.p2.x-e.p1.x; 
	e=e.p2.y-e.p1.y; 
	var j=h*g+b*e,k=g*g+e*e; 
	i=j*j-k*i; 
	if(i<0||k<Number.MIN_VALUE)return b2.Shape.e_missCollide; 
	i=-(j+Math.sqrt(i)); 
	if(0<=i&&i<=f*k){
	    i/=k; 
	    c[0]=i; 
	    d.x=h+i*g; 
	    d.y=
		b+i*e; 
	    d.Normalize(); 
	    return b2.Shape.e_hitCollide}return b2.Shape.e_missCollide
    }; 
    a.ComputeAABB=function(b,c){
	var d=c.R,e=c.position.x+(d.col1.x*this.m_localPosition.x+d.col2.x*this.m_localPosition.y); 
	c=c.position.y+(d.col1.y*this.m_localPosition.x+d.col2.y*this.m_localPosition.y); 
	b.lowerBound.Set(e-this.m_radius,c-this.m_radius); 
	b.upperBound.Set(e+this.m_radius,c+this.m_radius)
    }; 

    a.ComputeSweptAABB=function(b,c,d){
	var e; 
	e=c.R; 
	var f=c.position.x+(e.col1.x*this.m_localPosition.x+e.col2.x*this.m_localPosition.y); 
	c=c.position.y+(e.col1.y*this.m_localPosition.x+e.col2.y*this.m_localPosition.y); 
	e=d.R; 
	var g=d.position.x+(e.col1.x*this.m_localPosition.x+e.col2.x*this.m_localPosition.y); 
	d=d.position.y+(e.col1.y*this.m_localPosition.x+e.col2.y*this.m_localPosition.y); 
	b.lowerBound.Set((f<g?f:g)-this.m_radius,(c<d?c:d)-this.m_radius); 
	b.upperBound.Set((f>g?f:g)+this.m_radius,(c>d?c:d)+
			 this.m_radius)
    }; 
    a.ComputeMass=function(b){
	b.mass=this.m_density*b2.Settings.pi*this.m_radius*this.m_radius; 
	b.center.SetV(this.m_localPosition); 
	b.I=b.mass*(0.5*this.m_radius*this.m_radius+(this.m_localPosition.x*this.m_localPosition.x+this.m_localPosition.y*this.m_localPosition.y))
    }; 
    a.GetLocalPosition=function(){
	return this.m_localPosition
    }; 
    a.GetRadius=function(){
	return this.m_radius
    }; 

    a.UpdateSweepRadius=function(b){
	var c=this.m_localPosition.x-b.x; 
	b=this.m_localPosition.y-b.y; 
	c=Math.sqrt(c*c+b*b); 
	this.m_sweepRadius=c+this.m_radius-b2.Settings.toiSlop
    }; 
    b2.Joint=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.Joint.prototype.__constructor=function(b){
	this.m_type=b.type; 
	this.m_next=this.m_prev=null; 
	this.m_body1=b.body1; 
	this.m_body2=b.body2; 
	this.m_collideConnected=b.collideConnected; 
	this.m_islandFlag=false; 
	this.m_userData=b.userData
    }; 
    b2.Joint.prototype.__varz=function(){
	this.m_node1=new b2.JointEdge; 
	this.m_node2=new b2.JointEdge
    }; 
    b2.Joint.e_unknownJoint=0; 
    b2.Joint.e_revoluteJoint=1; 
    b2.Joint.e_prismaticJoint=2; 

    b2.Joint.e_distanceJoint=3; 
    b2.Joint.e_pulleyJoint=4; 
    b2.Joint.e_mouseJoint=5; 
    b2.Joint.e_gearJoint=6; 
    b2.Joint.e_inactiveLimit=0; 
    b2.Joint.e_atLowerLimit=1; 
    b2.Joint.e_atUpperLimit=2; 
    b2.Joint.e_equalLimits=3; 

    b2.Joint.Create=function(b){
	var c=null; 
	switch(b.type){
	case b2.Joint.e_distanceJoint:c=new b2.DistanceJoint(b); 
	    break; 
	case b2.Joint.e_mouseJoint:c=new b2.MouseJoint(b); 
	    break; 
	case b2.Joint.e_prismaticJoint:c=new b2.PrismaticJoint(b); 
	    break; 
	case b2.Joint.e_revoluteJoint:c=new b2.RevoluteJoint(b); 
	    break; 
	case b2.Joint.e_pulleyJoint:c=new b2.PulleyJoint(b); 
	    break; 
	case b2.Joint.e_gearJoint:c=new b2.GearJoint(b); 
	    break; 
	default:break}return c
    }; 
    b2.Joint.Destroy=function(){
	
    }; 
    a=b2.Joint.prototype; 
    a.m_type=0; 
    a.m_prev=null; 

    a.m_next=null; 
    a.m_node1=new b2.JointEdge; 
    a.m_node2=new b2.JointEdge; 
    a.m_body1=null; 
    a.m_body2=null; 
    a.m_inv_dt=null; 
    a.m_islandFlag=null; 
    a.m_collideConnected=null; 
    a.m_userData=null; 
    a.GetType=function(){
	return this.m_type
    }; 
    a.GetAnchor1=function(){
	return null
    }; 
    a.GetAnchor2=function(){
	return null
    }; 
    a.GetReactionForce=function(){
	return null
    }; 
    a.GetReactionTorque=function(){
	return 0
    }; 
    a.GetBody1=function(){
	return this.m_body1
    }; 
    a.GetBody2=function(){
	return this.m_body2
    }; 
    a.GetNext=function(){
	return this.m_next
    }; 

    a.GetUserData=function(){
	return this.m_userData
    }; 
    a.SetUserData=function(b){
	this.m_userData=b
    }; 
    a.InitVelocityConstraints=function(){
	
    }; 
    a.SolveVelocityConstraints=function(){
	
    }; 
    a.InitPositionConstraints=function(){
	
    }; 
    a.SolvePositionConstraints=function(){
	return false
    }; 
    b2.GearJoint=function(){
	b2.Joint.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.GearJoint.prototype,b2.Joint.prototype); 
    a=b2.GearJoint.prototype; 
    a._super=function(){
	b2.Joint.prototype.__constructor.apply(this,arguments)
    }; 

    a.__constructor=function(b){
	this._super(b); 
	var c=b.joint1.m_type,d=b.joint2.m_type; 
	this.m_prismatic2=this.m_revolute2=this.m_prismatic1=this.m_revolute1=null; 
	this.m_ground1=b.joint1.m_body1; 
	this.m_body1=b.joint1.m_body2; 
	if(c==b2.Joint.e_revoluteJoint){
	    this.m_revolute1=b.joint1; 
	    this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1); 
	    this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2); 
	    c=this.m_revolute1.GetJointAngle()}else{
		this.m_prismatic1=b.joint1; 
		this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1); 

		this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2); 
		c=this.m_prismatic1.GetJointTranslation()}this.m_ground2=b.joint2.m_body1; 
	this.m_body2=b.joint2.m_body2; 
	if(d==b2.Joint.e_revoluteJoint){
	    this.m_revolute2=b.joint2; 
	    this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1); 
	    this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2); 
	    d=this.m_revolute2.GetJointAngle()}else{
		this.m_prismatic2=b.joint2; 
		this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1); 
		this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2); 

		d=this.m_prismatic2.GetJointTranslation()}this.m_ratio=b.ratio; 
	this.m_constant=c+this.m_ratio*d; 
	this.m_force=0
    }; 
    a.__varz=function(){
	this.m_groundAnchor1=new b2.Vec2; 
	this.m_groundAnchor2=new b2.Vec2; 
	this.m_localAnchor1=new b2.Vec2; 
	this.m_localAnchor2=new b2.Vec2; 
	this.m_J=new b2.Jacobian
    }; 
    a.m_ground1=null; 
    a.m_ground2=null; 
    a.m_revolute1=null; 
    a.m_prismatic1=null; 
    a.m_revolute2=null; 
    a.m_prismatic2=null; 
    a.m_groundAnchor1=new b2.Vec2; 
    a.m_groundAnchor2=new b2.Vec2; 
    a.m_localAnchor1=new b2.Vec2; 
    a.m_localAnchor2=new b2.Vec2; 

    a.m_J=new b2.Jacobian; 
    a.m_constant=null; 
    a.m_ratio=null; 
    a.m_mass=null; 
    a.m_force=null; 
    a.GetAnchor1=function(){
	return this.m_body1.GetWorldPoint(this.m_localAnchor1)
    }; 
    a.GetAnchor2=function(){
	return this.m_body2.GetWorldPoint(this.m_localAnchor2)
    }; 
    a.GetReactionForce=function(){
	return new b2.Vec2(this.m_force*this.m_J.linear2.x,this.m_force*this.m_J.linear2.y)
    }; 

    a.GetReactionTorque=function(){
	var b=this.m_body2.m_xf.R,c=this.m_localAnchor1.x-this.m_body2.m_sweep.localCenter.x,d=this.m_localAnchor1.y-this.m_body2.m_sweep.localCenter.y,e=b.col1.x*c+b.col2.x*d; 
	d=b.col1.y*c+b.col2.y*d; 
	c=e; 
	return e=this.m_force*this.m_J.angular2-(c*this.m_force*this.m_J.linear2.y-d*this.m_force*this.m_J.linear2.x)
    }; 
    a.GetRatio=function(){
	return this.m_ratio
    }; 

    a.InitVelocityConstraints=function(b){
	var c=this.m_ground1,d=this.m_ground2,e=this.m_body1,f=this.m_body2,g,h,i,j,k,l=0; 
	this.m_J.SetZero(); 
	if(this.m_revolute1){
	    this.m_J.angular1=-1; 
	    l+=e.m_invI}else{
		j=c.m_xf.R; 
		g=this.m_prismatic1.m_localXAxis1; 
		c=j.col1.x*g.x+j.col2.x*g.y; 
		g=j.col1.y*g.x+j.col2.y*g.y; 
		j=e.m_xf.R; 
		h=this.m_localAnchor1.x-e.m_sweep.localCenter.x; 
		i=this.m_localAnchor1.y-e.m_sweep.localCenter.y; 
		k=j.col1.x*h+j.col2.x*i; 
		i=j.col1.y*h+j.col2.y*i; 
		h=k; 
		j=h*g-i*c; 
		this.m_J.linear1.Set(-c,-g); 
		this.m_J.angular1=
		    -j; 
		l+=e.m_invMass+e.m_invI*j*j}if(this.m_revolute2){
		    this.m_J.angular2=-this.m_ratio; 
		    l+=this.m_ratio*this.m_ratio*f.m_invI}else{
			j=d.m_xf.R; 
			g=this.m_prismatic2.m_localXAxis1; 
			c=j.col1.x*g.x+j.col2.x*g.y; 
			g=j.col1.y*g.x+j.col2.y*g.y; 
			j=f.m_xf.R; 
			h=this.m_localAnchor2.x-f.m_sweep.localCenter.x; 
			i=this.m_localAnchor2.y-f.m_sweep.localCenter.y; 
			k=j.col1.x*h+j.col2.x*i; 
			i=j.col1.y*h+j.col2.y*i; 
			h=k; 
			j=h*g-i*c; 
			this.m_J.linear2.Set(-this.m_ratio*c,-this.m_ratio*g); 
			this.m_J.angular2=-this.m_ratio*j; 
			l+=this.m_ratio*
			    this.m_ratio*(f.m_invMass+f.m_invI*j*j)}this.m_mass=1/l; 
	if(b.warmStarting){
	    b=b.dt*this.m_force; 
	    e.m_linearVelocity.x+=e.m_invMass*b*this.m_J.linear1.x; 
	    e.m_linearVelocity.y+=e.m_invMass*b*this.m_J.linear1.y; 
	    e.m_angularVelocity+=e.m_invI*b*this.m_J.angular1; 
	    f.m_linearVelocity.x+=f.m_invMass*b*this.m_J.linear2.x; 
	    f.m_linearVelocity.y+=f.m_invMass*b*this.m_J.linear2.y; 
	    f.m_angularVelocity+=f.m_invI*b*this.m_J.angular2}else this.m_force=0
    }; 

    a.SolveVelocityConstraints=function(b){
	var c=this.m_body1,d=this.m_body2,e=this.m_J.Compute(c.m_linearVelocity,c.m_angularVelocity,d.m_linearVelocity,d.m_angularVelocity); 
	e=-b.inv_dt*this.m_mass*e; 
	this.m_force+=e; 
	b=b.dt*e; 
	c.m_linearVelocity.x+=c.m_invMass*b*this.m_J.linear1.x; 
	c.m_linearVelocity.y+=c.m_invMass*b*this.m_J.linear1.y; 
	c.m_angularVelocity+=c.m_invI*b*this.m_J.angular1; 
	d.m_linearVelocity.x+=d.m_invMass*b*this.m_J.linear2.x; 
	d.m_linearVelocity.y+=d.m_invMass*b*this.m_J.linear2.y; 
	d.m_angularVelocity+=
	d.m_invI*b*this.m_J.angular2
    }; 

    a.SolvePositionConstraints=function(){
	var b=this.m_body1,c=this.m_body2,d,e; 
	d=this.m_revolute1?this.m_revolute1.GetJointAngle():this.m_prismatic1.GetJointTranslation(); 
	e=this.m_revolute2?this.m_revolute2.GetJointAngle():this.m_prismatic2.GetJointTranslation(); 
	d=-this.m_mass*(this.m_constant-(d+this.m_ratio*e)); 
	b.m_sweep.c.x+=b.m_invMass*d*this.m_J.linear1.x; 
	b.m_sweep.c.y+=b.m_invMass*d*this.m_J.linear1.y; 
	b.m_sweep.a+=b.m_invI*d*this.m_J.angular1; 
	c.m_sweep.c.x+=c.m_invMass*d*this.m_J.linear2.x; 
	c.m_sweep.c.y+=
	c.m_invMass*d*this.m_J.linear2.y; 
	c.m_sweep.a+=c.m_invI*d*this.m_J.angular2; 
	b.SynchronizeTransform(); 
	c.SynchronizeTransform(); 
	return 0<b2.Settings.linearSlop
    }; 
    b2.GearJointDef=function(){
	b2.JointDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.GearJointDef.prototype,b2.JointDef.prototype); 
    a=b2.GearJointDef.prototype; 
    a._super=function(){
	b2.JointDef.prototype.__constructor.apply(this,arguments)
    }; 
    a.__constructor=function(){
	this.type=b2.Joint.e_gearJoint; 
	this.joint2=this.joint1=null; 
	this.ratio=1
    }; 
    a.__varz=function(){
	
    }; 
    a.joint1=null; 
    a.joint2=null; 
    a.ratio=null; 
    b2.BroadPhase=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    b2.BroadPhase.prototype.__constructor=function(b,c){
	var d=0; 
	this.m_pairManager.Initialize(this,c); 
	this.m_worldAABB=b; 
	for(d=this.m_proxyCount=0; 
	    d<b2.Settings.maxProxies; 
	    d++){
	    this.m_queryResults[d]=0; 
	    this.m_querySortKeys[d]=0}this.m_bounds=new Array(2); 
	for(d=0; 
	    d<2; 
	    d++){
	    this.m_bounds[d]=new Array(2*b2.Settings.maxProxies); 
	    for(c=0; 
		c<2*b2.Settings.maxProxies; 
		c++)this.m_bounds[d][c]=new b2.Bound}d=b.upperBound.y-b.lowerBound.y; 
	this.m_quantizationFactor.x=b2.Settings.USHRT_MAX/(b.upperBound.x-b.lowerBound.x); 

	this.m_quantizationFactor.y=b2.Settings.USHRT_MAX/d; 
	for(d=0; 
	    d<b2.Settings.maxProxies-1; 
	    ++d){
	    b=new b2.Proxy; 
	    this.m_proxyPool[d]=b; 
	    b.SetNext(d+1); 
	    b.timeStamp=0; 
	    b.overlapCount=b2.BroadPhase.invalid; 
	    b.userData=null}b=new b2.Proxy; 
	this.m_proxyPool[parseInt(b2.Settings.maxProxies-1)]=b; 
	b.SetNext(b2.Pair.nullProxy); 
	b.timeStamp=0; 
	b.overlapCount=b2.BroadPhase.invalid; 
	b.userData=null; 
	this.m_freeProxy=0; 
	this.m_timeStamp=1; 
	this.m_queryResultCount=0
    }; 

    b2.BroadPhase.prototype.__varz=function(){
	this.m_pairManager=new b2.PairManager; 
	this.m_proxyPool=new Array(b2.Settings.maxPairs); 
	this.m_bounds=new Array(2*b2.Settings.maxProxies); 
	this.m_querySortKeys=new Array(b2.Settings.maxProxies); 
	this.m_queryResults=new Array(b2.Settings.maxProxies); 
	this.m_quantizationFactor=new b2.Vec2
    }; 
    b2.BroadPhase.s_validate=false; 
    b2.BroadPhase.invalid=b2.Settings.USHRT_MAX; 
    b2.BroadPhase.nullEdge=b2.Settings.USHRT_MAX; 

    b2.BroadPhase.BinarySearch=function(b,c,d){
	var e=0; 
	for(c=c-1; 
	    e<=c; 
	   ){
	    var f=Math.round((e+c)/2),g=b[f]; 
	    if(g.value>d)c=f-1; 
	    else if(g.value<d)e=f+1; 
	    else return parseInt(f)}return parseInt(e)
    }; 
    a=b2.BroadPhase.prototype; 
    a.m_pairManager=new b2.PairManager; 
    a.m_proxyPool=new Array(b2.Settings.maxPairs); 
    a.m_freeProxy=0; 
    a.m_bounds=new Array(2*b2.Settings.maxProxies); 
    a.m_querySortKeys=new Array(b2.Settings.maxProxies); 
    a.m_queryResults=new Array(b2.Settings.maxProxies); 
    a.m_queryResultCount=0; 

    a.m_worldAABB=null; 
    a.m_quantizationFactor=new b2.Vec2; 
    a.m_proxyCount=0; 
    a.m_timeStamp=0; 

    a.ComputeBounds=function(b,c,d){
	var e=d.lowerBound.x,f=d.lowerBound.y; 
	e=b2.Math.Min(e,this.m_worldAABB.upperBound.x); 
	f=b2.Math.Min(f,this.m_worldAABB.upperBound.y); 
	e=b2.Math.Max(e,this.m_worldAABB.lowerBound.x); 
	f=b2.Math.Max(f,this.m_worldAABB.lowerBound.y); 
	var g=d.upperBound.x; 
	d=d.upperBound.y; 
	g=b2.Math.Min(g,this.m_worldAABB.upperBound.x); 
	d=b2.Math.Min(d,this.m_worldAABB.upperBound.y); 
	g=b2.Math.Max(g,this.m_worldAABB.lowerBound.x); 
	d=b2.Math.Max(d,this.m_worldAABB.lowerBound.y); 
	b[0]=parseInt(this.m_quantizationFactor.x*
		      (e-this.m_worldAABB.lowerBound.x))&b2.Settings.USHRT_MAX-1; 
	c[0]=parseInt(this.m_quantizationFactor.x*(g-this.m_worldAABB.lowerBound.x))%65535|1; 
	b[1]=parseInt(this.m_quantizationFactor.y*(f-this.m_worldAABB.lowerBound.y))&b2.Settings.USHRT_MAX-1; 
	c[1]=parseInt(this.m_quantizationFactor.y*(d-this.m_worldAABB.lowerBound.y))%65535|1
    }; 

    a.TestOverlapValidate=function(b,c){
	for(var d=0; 
	    d<2; 
	    ++d){
	    var e=this.m_bounds[d],f=e[b.lowerBounds[d]],g=e[c.upperBounds[d]]; 
	    if(f.value>g.value)return false; 
	    f=e[b.upperBounds[d]]; 
	    g=e[c.lowerBounds[d]]; 
	    if(f.value<g.value)return false}return true
    }; 

    a.Query=function(b,c,d,e,f,g,h){
	d=b2.BroadPhase.BinarySearch(f,g,d); 
	e=b2.BroadPhase.BinarySearch(f,g,e); 
	for(var i=d; 
	    i<e; 
	    ++i){
	    g=f[i]; 
	    g.IsLower()&&this.IncrementOverlapCount(g.proxyId)}if(d>0){
		i=d-1; 
		g=f[i]; 
		for(var j=g.stabbingCount; 
		    j>0; 
		   ){
		    g=f[i]; 
		    if(g.IsLower())if(d<=this.m_proxyPool[g.proxyId].upperBounds[h]){
			this.IncrementOverlapCount(g.proxyId); 
			--j}--i}}b[0]=d; 
	c[0]=e
    }; 

    a.IncrementOverlapCount=function(b){
	var c=this.m_proxyPool[b]; 
	if(c.timeStamp<this.m_timeStamp){
	    c.timeStamp=this.m_timeStamp; 
	    c.overlapCount=1}else{
		c.overlapCount=2; 
		this.m_queryResults[this.m_queryResultCount]=b; 
		++this.m_queryResultCount}
    }; 
    a.IncrementTimeStamp=function(){
	if(this.m_timeStamp==b2.Settings.USHRT_MAX){
	    for(var b=0; 
		b<b2.Settings.maxProxies; 
		++b)this.m_proxyPool[b].timeStamp=0; 
	    this.m_timeStamp=1}else++this.m_timeStamp
    }; 

    a.AddProxyResult=function(b,c,d,e){
	e=e(c.userData); 
	if(!(e<0)){
	    for(c=0; 
		c<this.m_queryResultCount&&this.m_querySortKeys[c]<e; 
	       )c++; 
	    e=e; 
	    b=b; 
	    this.m_queryResultCount+=1; 
	    if(this.m_queryResultCount>d)this.m_queryResultCount=d; 
	    for(; 
		c<this.m_queryResultCount; 
	       ){
		d=this.m_querySortKeys[c]; 
		var f=this.m_queryResults[c]; 
		this.m_querySortKeys[c]=e; 
		this.m_queryResults[c]=b; 
		e=d; 
		b=f; 
		c++}}
    }; 

    a.InRange=function(b){
	var c,d,e,f; 
	c=b.lowerBound.x; 
	d=b.lowerBound.y; 
	c-=this.m_worldAABB.upperBound.x; 
	d-=this.m_worldAABB.upperBound.y; 
	e=this.m_worldAABB.lowerBound.x; 
	f=this.m_worldAABB.lowerBound.y; 
	e-=b.upperBound.x; 
	f-=b.upperBound.y; 
	c=b2.Math.Max(c,e); 
	d=b2.Math.Max(d,f); 
	return b2.Math.Max(c,d)<0
    }; 
    a.GetProxy=function(b){
	var c=this.m_proxyPool[b]; 
	if(b==b2.Pair.nullProxy||c.IsValid()==false)return null; 
	return c
    }; 

    a.CreateProxy=function(b,c){
	var d=0,e,f=this.m_freeProxy; 
	e=this.m_proxyPool[f]; 
	this.m_freeProxy=e.GetNext(); 
	e.overlapCount=0; 
	e.userData=c; 
	c=2*this.m_proxyCount; 
	e=[]; 
	var g=[]; 
	this.ComputeBounds(e,g,b); 
	for(b=0; 
	    b<2; 
	    ++b){
	    var h=this.m_bounds[b],i=0,j=0; 
	    i=[i]; 
	    j=[j]; 
	    this.Query(i,j,e[b],g[b],h,c,b); 
	    i=i[0]; 
	    j=j[0]; 
	    var k=[],l=0,m=c-j,n; 
	    for(l=0; 
		l<m; 
		l++){
		k[l]=new b2.Bound; 
		n=k[l]; 
		d=h[parseInt(j+l)]; 
		n.value=d.value; 
		n.proxyId=d.proxyId; 
		n.stabbingCount=d.stabbingCount}m=k.length; 
	    var o=j+2; 
	    for(l=0; 
		l<m; 
		l++){
		d=k[l]; 
		n=
		    h[parseInt(o+l)]; 
		n.value=d.value; 
		n.proxyId=d.proxyId; 
		n.stabbingCount=d.stabbingCount}k=[]; 
	    m=j-i; 
	    for(l=0; 
		l<m; 
		l++){
		k[l]=new b2.Bound; 
		n=k[l]; 
		d=h[parseInt(i+l)]; 
		n.value=d.value; 
		n.proxyId=d.proxyId; 
		n.stabbingCount=d.stabbingCount}m=k.length; 
	    o=i+1; 
	    for(l=0; 
		l<m; 
		l++){
		d=k[l]; 
		n=h[parseInt(o+l)]; 
		n.value=d.value; 
		n.proxyId=d.proxyId; 
		n.stabbingCount=d.stabbingCount}++j; 
	    n=h[i]; 
	    d=h[j]; 
	    n.value=e[b]; 
	    n.proxyId=f; 
	    d.value=g[b]; 
	    d.proxyId=f; 
	    k=h[parseInt(i-1)]; 
	    n.stabbingCount=i==0?0:k.stabbingCount; 
	    k=h[parseInt(j-1)]; 
	    d.stabbingCount=
		k.stabbingCount; 
	    for(d=i; 
		d<j; 
		++d){
		k=h[d]; 
		k.stabbingCount++}for(d=i; 
				      d<c+2; 
				      ++d){
		    n=h[d]; 
		    i=this.m_proxyPool[n.proxyId]; 
		    if(n.IsLower())i.lowerBounds[b]=d; 
		    else i.upperBounds[b]=d}}++this.m_proxyCount; 
	for(c=0; 
	    c<this.m_queryResultCount; 
	    ++c)this.m_pairManager.AddBufferedPair(f,this.m_queryResults[c]); 
	this.m_pairManager.Commit(); 
	this.m_queryResultCount=0; 
	this.IncrementTimeStamp(); 
	return f
    }; 

    a.DestroyProxy=function(b){
	for(var c,d,e=this.m_proxyPool[b],f=2*this.m_proxyCount,g=0; 
	    g<2; 
	    ++g){
	    var h=this.m_bounds[g],i=e.lowerBounds[g],j=e.upperBounds[g]; 
	    c=h[i]; 
	    var k=c.value; 
	    d=h[j]; 
	    var l=d.value,m=[],n=0,o=j-i-1; 
	    for(n=0; 
		n<o; 
		n++){
		m[n]=new b2.Bound; 
		c=m[n]; 
		d=h[parseInt(i+1+n)]; 
		c.value=d.value; 
		c.proxyId=d.proxyId; 
		c.stabbingCount=d.stabbingCount}o=m.length; 
	    var q=i; 
	    for(n=0; 
		n<o; 
		n++){
		d=m[n]; 
		c=h[parseInt(q+n)]; 
		c.value=d.value; 
		c.proxyId=d.proxyId; 
		c.stabbingCount=d.stabbingCount}m=[]; 
	    o=f-j-1; 
	    for(n=0; 
		n<o; 
		n++){
		m[n]=
		    new b2.Bound; 
		c=m[n]; 
		d=h[parseInt(j+1+n)]; 
		c.value=d.value; 
		c.proxyId=d.proxyId; 
		c.stabbingCount=d.stabbingCount}o=m.length; 
	    q=j-1; 
	    for(n=0; 
		n<o; 
		n++){
		d=m[n]; 
		c=h[parseInt(q+n)]; 
		c.value=d.value; 
		c.proxyId=d.proxyId; 
		c.stabbingCount=d.stabbingCount}o=f-2; 
	    for(d=i; 
		d<o; 
		++d){
		c=h[d]; 
		m=this.m_proxyPool[c.proxyId]; 
		if(c.IsLower())m.lowerBounds[g]=d; 
		else m.upperBounds[g]=d}o=j-1; 
	    for(i=i; 
		i<o; 
		++i){
		c=h[i]; 
		c.stabbingCount--}this.Query([0],[0],k,l,h,f-2,g)}for(c=0; 
								      c<this.m_queryResultCount; 
								      ++c)this.m_pairManager.RemoveBufferedPair(b,
														this.m_queryResults[c]); 
	this.m_pairManager.Commit(); 
	this.m_queryResultCount=0; 
	this.IncrementTimeStamp(); 
	e.userData=null; 
	e.overlapCount=b2.BroadPhase.invalid; 
	e.lowerBounds[0]=b2.BroadPhase.invalid; 
	e.lowerBounds[1]=b2.BroadPhase.invalid; 
	e.upperBounds[0]=b2.BroadPhase.invalid; 
	e.upperBounds[1]=b2.BroadPhase.invalid; 
	e.SetNext(this.m_freeProxy); 
	this.m_freeProxy=b; 
	--this.m_proxyCount
    }; 

    a.MoveProxy=function(b,c){
	var d,e,f=0,g=0,h; 
	d=0; 
	if(!(b==b2.Pair.nullProxy||b2.Settings.maxProxies<=b))if(c.IsValid()!=false){
	    var i=2*this.m_proxyCount,j=this.m_proxyPool[b],k=new b2.BoundValues; 
	    this.ComputeBounds(k.lowerValues,k.upperValues,c); 
	    var l=new b2.BoundValues; 
	    for(f=0; 
		f<2; 
		++f){
		c=this.m_bounds[f][j.lowerBounds[f]]; 
		l.lowerValues[f]=c.value; 
		c=this.m_bounds[f][j.upperBounds[f]]; 
		l.upperValues[f]=c.value}for(f=0; 
					     f<2; 
					     ++f){
		    var m=this.m_bounds[f],n=j.lowerBounds[f],o=j.upperBounds[f],q=k.lowerValues[f],
		    r=k.upperValues[f]; 
		    c=m[n]; 
		    var s=q-c.value; 
		    c.value=q; 
		    c=m[o]; 
		    var v=r-c.value; 
		    c.value=r; 
		    if(s<0)for(g=n; 
			       g>0&&q<m[parseInt(g-1)].value; 
			      ){
			c=m[g]; 
			h=m[parseInt(g-1)]; 
			d=h.proxyId; 
			e=this.m_proxyPool[h.proxyId]; 
			h.stabbingCount++; 
			if(h.IsUpper()==true){
			    this.TestOverlap(k,e)&&this.m_pairManager.AddBufferedPair(b,d); 
			    d=e.upperBounds; 
			    e=d[f]; 
			    e++; 
			    d[f]=e; 
			    c.stabbingCount++}else{
				d=e.lowerBounds; 
				e=d[f]; 
				e++; 
				d[f]=e; 
				c.stabbingCount--}d=j.lowerBounds; 
			e=d[f]; 
			e--; 
			d[f]=e; 
			c.Swap(h); 
			--g}if(v>0)for(g=o; 
				       g<i-1&&m[parseInt(g+1)].value<=
				       r; 
				      ){
			    c=m[g]; 
			    h=m[parseInt(g+1)]; 
			    d=h.proxyId; 
			    e=this.m_proxyPool[d]; 
			    h.stabbingCount++; 
			    if(h.IsLower()==true){
				this.TestOverlap(k,e)&&this.m_pairManager.AddBufferedPair(b,d); 
				d=e.lowerBounds; 
				e=d[f]; 
				e--; 
				d[f]=e; 
				c.stabbingCount++}else{
				    d=e.upperBounds; 
				    e=d[f]; 
				    e--; 
				    d[f]=e; 
				    c.stabbingCount--}d=j.upperBounds; 
			    e=d[f]; 
			    e++; 
			    d[f]=e; 
			    c.Swap(h); 
			    g++}if(s>0)for(g=n; 
					   g<i-1&&m[parseInt(g+1)].value<=q; 
					  ){
				c=m[g]; 
				h=m[parseInt(g+1)]; 
				d=h.proxyId; 
				e=this.m_proxyPool[d]; 
				h.stabbingCount--; 
				if(h.IsUpper()){
				    this.TestOverlap(l,e)&&this.m_pairManager.RemoveBufferedPair(b,
												 d); 
				    d=e.upperBounds; 
				    e=d[f]; 
				    e--; 
				    d[f]=e; 
				    c.stabbingCount--}else{
					d=e.lowerBounds; 
					e=d[f]; 
					e--; 
					d[f]=e; 
					c.stabbingCount++}d=j.lowerBounds; 
				e=d[f]; 
				e++; 
				d[f]=e; 
				c.Swap(h); 
				g++}if(v<0)for(g=o; 
					       g>0&&r<m[parseInt(g-1)].value; 
					      ){
				    c=m[g]; 
				    h=m[parseInt(g-1)]; 
				    d=h.proxyId; 
				    e=this.m_proxyPool[d]; 
				    h.stabbingCount--; 
				    if(h.IsLower()==true){
					this.TestOverlap(l,e)&&this.m_pairManager.RemoveBufferedPair(b,d); 
					d=e.lowerBounds; 
					e=d[f]; 
					e++; 
					d[f]=e; 
					c.stabbingCount--}else{
					    d=e.upperBounds; 
					    e=d[f]; 
					    e++; 
					    d[f]=e; 
					    c.stabbingCount++}d=j.upperBounds; 
				    e=d[f]; 

				    e--; 
				    d[f]=e; 
				    c.Swap(h); 
				    g--}}}
    }; 
    a.Commit=function(){
	this.m_pairManager.Commit()
    }; 
    a.QueryAABB=function(b,c,d){
	var e=[],f=[]; 
	this.ComputeBounds(e,f,b); 
	b=[0]; 
	var g=[0]; 
	this.Query(b,g,e[0],f[0],this.m_bounds[0],2*this.m_proxyCount,0); 
	this.Query(b,g,e[1],f[1],this.m_bounds[1],2*this.m_proxyCount,1); 
	for(f=e=0; 
	    f<this.m_queryResultCount&&e<d; 
	    ++f,++e)c[f]=this.m_proxyPool[this.m_queryResults[f]].userData; 
	this.m_queryResultCount=0; 
	this.IncrementTimeStamp(); 
	return e
    }; 

    a.Validate=function(){
	for(var b=0; 
	    b<2; 
	    ++b)for(var c=this.m_bounds[b],d=2*this.m_proxyCount,e=0,f=0; 
		    f<d; 
		    ++f)if(c[f].IsLower()==true)e++; 
	else e--
    }; 

    a.QuerySegment=function(b,c,d,e){
	var f=(b.p2.x-b.p1.x)*this.m_quantizationFactor.x,g=(b.p2.y-b.p1.y)*this.m_quantizationFactor.y,h=f<-Number.MIN_VALUE?-1:f>Number.MIN_VALUE?1:0,i=g<-Number.MIN_VALUE?-1:g>Number.MIN_VALUE?1:0,j=this.m_quantizationFactor.x*(b.p1.x-this.m_worldAABB.lowerBound.x); 
	b=this.m_quantizationFactor.y*(b.p1.y-this.m_worldAABB.lowerBound.y); 
	var k=[],l=[]; 
	k[0]=parseInt(j)&b2.Settings.USHRT_MAX-1; 
	k[1]=parseInt(b)&b2.Settings.USHRT_MAX-1; 
	l[0]=k[0]+1; 
	l[1]=k[1]+1; 
	var m=0,n=0,o=0; 
	n=[0]; 

	o=[0]; 
	this.Query(n,o,k[0],l[0],this.m_bounds[0],2*this.m_proxyCount,0); 
	m=h>=0?o[0]-1:n[0]; 
	this.Query(n,o,k[1],l[1],this.m_bounds[1],2*this.m_proxyCount,1); 
	n=i>=0?o[0]-1:n[0]; 
	if(e!=null){
	    for(k=0; 
		k<this.m_queryResultCount; 
		k++)this.m_querySortKeys[k]=e(this.m_proxyPool[this.m_queryResults[k]].userData); 
	    for(k=0; 
		k<this.m_queryResultCount-1; 
	       ){
		l=this.m_querySortKeys[k]; 
		o=this.m_querySortKeys[k+1]; 
		if(l<0?o>=0:l>o&&o>=0){
		    this.m_querySortKeys[k+1]=l; 
		    this.m_querySortKeys[k]=o; 
		    l=this.m_queryResults[k+1]; 
		    this.m_queryResults[k+
					1]=this.m_queryResults[k]; 
		    this.m_queryResults[k]=l; 
		    k--; 
		    if(k==-1)k=1}else k++}for(; 
					      this.m_queryResultCount>0&&this.m_querySortKeys[this.m_queryResultCount-1]<0; 
					     )this.m_queryResultCount--}k=true; 
	var q,r; 
	if(m<0||m>=this.m_proxyCount*2)k=false; 
	if(n<0||n>=this.m_proxyCount*2)k=false; 
	if(k){
	    if(h!=0){
		if(h>0){
		    m++; 
		    if(m==this.m_proxyCount*2)k=false}else{
			m--; 
			if(m<0)k=false}q=(this.m_bounds[0][m].value-j)/f}if(i!=0){
			    if(i>0){
				n++; 
				if(n==this.m_proxyCount*2)k=false}else{
				    n--; 
				    if(n<0)k=false}r=(this.m_bounds[1][n].value-
						      b)/g}}for(; 
								k; 
							       )if(i==0||h!=0&&q<r){
								   if(q>1)break; 
								   if(h>0?this.m_bounds[0][m].IsLower():this.m_bounds[0][m].IsUpper()){
								       o=this.m_bounds[0][m].proxyId; 
								       l=this.m_proxyPool[o]; 
								       if(i>=0){
									   if(l.lowerBounds[1]<=n-1&&l.upperBounds[1]>=n)if(e!=null)this.AddProxyResult(o,l,d,e); 
									   else{
									       this.m_queryResults[this.m_queryResultCount]=o; 
									       ++this.m_queryResultCount}}else if(l.lowerBounds[1]<=n&&l.upperBounds[1]>=n+1)if(e!=null)this.AddProxyResult(o,l,d,e); 
								       else{
									   this.m_queryResults[this.m_queryResultCount]=o; 
									   ++this.m_queryResultCount}}if(e!=
													 null&&this.m_queryResultCount==d&&this.m_queryResultCount>0&&q>this.m_querySortKeys[this.m_queryResultCount-1])break; 
								   if(h>0){
								       m++; 
								       if(m==this.m_proxyCount*2)break}else{
									   m--; 
									   if(m<0)break}q=(this.m_bounds[0][m].value-j)/f}else{
									       if(r>1)break; 
									       if(i>0?this.m_bounds[1][n].IsLower():this.m_bounds[1][n].IsUpper()){
										   o=this.m_bounds[1][n].proxyId; 
										   l=this.m_proxyPool[o]; 
										   if(h>=0){
										       if(l.lowerBounds[0]<=m-1&&l.upperBounds[0]>=m)if(e!=null)this.AddProxyResult(o,l,d,e); 
										       else{
											   this.m_queryResults[this.m_queryResultCount]=o; 

											   ++this.m_queryResultCount}}else if(l.lowerBounds[0]<=m&&l.upperBounds[0]>=m+1)if(e!=null)this.AddProxyResult(o,l,d,e); 
										   else{
										       this.m_queryResults[this.m_queryResultCount]=o; 
										       ++this.m_queryResultCount}}if(e!=null&&this.m_queryResultCount==d&&this.m_queryResultCount>0&&r>this.m_querySortKeys[this.m_queryResultCount-1])break; 
									       if(i>0){
										   n++; 
										   if(n==this.m_proxyCount*2)break}else{
										       n--; 
										       if(n<0)break}r=(this.m_bounds[1][n].value-b)/g}for(k=e=0; 
																	  k<this.m_queryResultCount&&e<d; 
																	  ++k,++e){
											   l=this.m_proxyPool[this.m_queryResults[k]]; 

											   c[k]=l.userData}this.m_queryResultCount=0; 
	this.IncrementTimeStamp(); 
	return e
    }; 
    a.TestOverlap=function(b,c){
	for(var d=0; 
	    d<2; 
	    ++d){
	    var e=this.m_bounds[d],f=e[c.upperBounds[d]]; 
	    if(b.lowerValues[d]>f.value)return false; 
	    f=e[c.lowerBounds[d]]; 
	    if(b.upperValues[d]<f.value)return false}return true
    }; 
    b2.TimeOfImpact=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.TimeOfImpact.prototype.__constructor=function(){
	
    }; 
    b2.TimeOfImpact.prototype.__varz=function(){
	
    }; 
    b2.TimeOfImpact.s_p1=new b2.Vec2; 
    b2.TimeOfImpact.s_p2=new b2.Vec2; 
    b2.TimeOfImpact.s_xf1=new b2.XForm; 
    b2.TimeOfImpact.s_xf2=new b2.XForm; 

    b2.TimeOfImpact.TimeOfImpact=function(b,c,d,e){
	var f,g,h=b.m_sweepRadius,i=d.m_sweepRadius,j=c.t0,k=c.c.x-c.c0.x,l=c.c.y-c.c0.y,m=e.c.x-e.c0.x,n=e.c.y-e.c0.y,o=c.a-c.a0,q=e.a-e.a0,r=0,s=b2.TimeOfImpact.s_p1,v=b2.TimeOfImpact.s_p2,z=0,y=g=0,t=0; 
	for(f=0; 
	    ; 
	   ){
	    t=(1-r)*j+r; 
	    g=b2.TimeOfImpact.s_xf1; 
	    y=b2.TimeOfImpact.s_xf2; 
	    c.GetXForm(g,t); 
	    e.GetXForm(y,t); 
	    t=b2.Distance.Distance(s,v,b,g,d,y); 
	    if(z==0)if(t>2*b2.Settings.toiSlop)f=1.5*b2.Settings.toiSlop; 
	    else{
		f=0.05*b2.Settings.toiSlop; 
		g=t-0.5*b2.Settings.toiSlop; 

		f=f>g?f:g}if(t-f<0.05*b2.Settings.toiSlop||z==20)break; 
	    g=v.x-s.x; 
	    y=v.y-s.y; 
	    var w=Math.sqrt(g*g+y*y); 
	    g/=w; 
	    y/=w; 
	    g=g*(k-m)+y*(l-n)+(o<0?-o:o)*h+(q<0?-q:q)*i; 
	    if(g==0){
		r=1; 
		break}t=r+(t-f)/g; 
	    if(t<0||1<t){
		r=1; 
		break}if(t<(1+100*Number.MIN_VALUE)*r)break; 
	    r=t; 
	    ++z}return r
    }; 
    b2.ShapeDef=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ShapeDef.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.type=b2.Shape.e_unknownShape; 
	this.filter=new b2.FilterData
    }; 
    a.type=b2.Shape.e_unknownShape; 
    a.userData=null; 
    a.friction=0.2; 
    a.restitution=0; 
    a.density=0; 
    a.isSensor=false; 
    a.filter=new b2.FilterData; 
    b2.PolygonDef=function(){
	b2.ShapeDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PolygonDef.prototype,b2.ShapeDef.prototype); 
    b2.PolygonDef.prototype._super=function(){
	b2.ShapeDef.prototype.__constructor.apply(this,arguments)
    }; 
    b2.PolygonDef.prototype.__constructor=function(){
	this.type=b2.Shape.e_polygonShape; 
	for(var b=this.vertexCount=0; 
	    b<b2.Settings.maxPolygonVertices; 
	    b++)this.vertices[b]=new b2.Vec2
    }; 

    b2.PolygonDef.prototype.__varz=function(){
	this.vertices=new Array(b2.Settings.maxPolygonVertices)
    }; 
    b2.PolygonDef.s_mat=new b2.Mat22; 
    b2.PolygonDef.prototype.vertices=new Array(b2.Settings.maxPolygonVertices); 
    b2.PolygonDef.prototype.vertexCount=0; 
    b2.PolygonDef.prototype.SetAsBox=function(b,c){
	this.vertexCount=4; 
	this.vertices[0].Set(-b,-c); 
	this.vertices[1].Set(b,-c); 
	this.vertices[2].Set(b,c); 
	this.vertices[3].Set(-b,c)
    }; 

    b2.PolygonDef.prototype.SetAsOrientedBox=function(b,c,d,e){
	this.vertexCount=4; 
	this.vertices[0].Set(-b,-c); 
	this.vertices[1].Set(b,-c); 
	this.vertices[2].Set(b,c); 
	this.vertices[3].Set(-b,c); 
	if(d){
	    c=d; 
	    var f=b2.PolygonDef.s_mat; 
	    f.Set(e); 
	    for(e=0; e<this.vertexCount; ++e){
		d=this.vertices[e]; 
		b=c.x+(f.col1.x*d.x+f.col2.x*d.y); 
		d.y=c.y+(f.col1.y*d.x+f.col2.y*d.y); 
		d.x=b
	    }
	}
    }; 
    b2.Contact=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    b2.Contact.prototype.__constructor=function(b,c){
	this.m_flags=0; 
	if(!b||!c)this.m_shape2=this.m_shape1=null; 
	else{
	    if(b.IsSensor()||c.IsSensor())this.m_flags|=b2.Contact.e_nonSolidFlag; 
	    this.m_shape1=b; 
	    this.m_shape2=c; 
	    this.m_manifoldCount=0; 
	    this.m_friction=Math.sqrt(this.m_shape1.m_friction*this.m_shape2.m_friction); 
	    this.m_restitution=b2.Math.Max(this.m_shape1.m_restitution,this.m_shape2.m_restitution); 
	    this.m_next=this.m_prev=null; 
	    this.m_node1.contact=null; 
	    this.m_node1.prev=null; 
	    this.m_node1.next=null; 

	    this.m_node1.other=null; 
	    this.m_node2.contact=null; 
	    this.m_node2.prev=null; 
	    this.m_node2.next=null; 
	    this.m_node2.other=null}
    }; 
    b2.Contact.prototype.__varz=function(){
	this.m_node1=new b2.ContactEdge; 
	this.m_node2=new b2.ContactEdge
    }; 
    b2.Contact.e_nonSolidFlag=1; 
    b2.Contact.e_slowFlag=2; 
    b2.Contact.e_islandFlag=4; 
    b2.Contact.e_toiFlag=8; 
    b2.Contact.s_registers=null; 
    b2.Contact.s_initialized=false; 

    b2.Contact.AddType=function(b,c,d,e){
	b2.Contact.s_registers[d][e].createFcn=b; 
	b2.Contact.s_registers[d][e].destroyFcn=c; 
	b2.Contact.s_registers[d][e].primary=true; 
	if(d!=e){
	    b2.Contact.s_registers[e][d].createFcn=b; 
	    b2.Contact.s_registers[e][d].destroyFcn=c; 
	    b2.Contact.s_registers[e][d].primary=false}
    }; 

    b2.Contact.InitializeRegisters=function(){
	b2.Contact.s_registers=new Array(b2.Shape.e_shapeTypeCount); 
	for(var b=0; 
	    b<b2.Shape.e_shapeTypeCount; 
	    b++){
	    b2.Contact.s_registers[b]=new Array(b2.Shape.e_shapeTypeCount); 
	    for(var c=0; 
		c<b2.Shape.e_shapeTypeCount; 
		c++)b2.Contact.s_registers[b][c]=new b2.ContactRegister}b2.Contact.AddType(b2.CircleContact.Create,b2.CircleContact.Destroy,b2.Shape.e_circleShape,b2.Shape.e_circleShape); 
	b2.Contact.AddType(b2.PolyAndCircleContact.Create,b2.PolyAndCircleContact.Destroy,b2.Shape.e_polygonShape,
			   b2.Shape.e_circleShape); 
	b2.Contact.AddType(b2.PolygonContact.Create,b2.PolygonContact.Destroy,b2.Shape.e_polygonShape,b2.Shape.e_polygonShape)
    }; 
    b2.Contact.Create=function(b,c,d){
	if(b2.Contact.s_initialized==false){
	    b2.Contact.InitializeRegisters(); 
	    b2.Contact.s_initialized=true}var e=b2.Contact.s_registers[b.m_type][c.m_type],f=e.createFcn; 
	if(f!=null)if(e.primary)return f(b,c,d); 
	else{
	    b=f(c,b,d); 
	    for(c=0; 
		c<b.m_manifoldCount; 
		++c){
		d=b.GetManifolds()[c]; 
		d.normal=d.normal.Negative()}return b}else return null
    }; 

    b2.Contact.Destroy=function(b,c){
	if(b.m_manifoldCount>0){
	    b.m_shape1.m_body.WakeUp(); 
	    b.m_shape2.m_body.WakeUp()}var d=b2.Contact.s_registers[b.m_shape1.m_type][b.m_shape2.m_type].destroyFcn; 
	d(b,c)
    }; 
    a=b2.Contact.prototype; 
    a.m_flags=0; 
    a.m_prev=null; 
    a.m_next=null; 
    a.m_node1=new b2.ContactEdge; 
    a.m_node2=new b2.ContactEdge; 
    a.m_shape1=null; 
    a.m_shape2=null; 
    a.m_manifoldCount=0; 
    a.m_friction=null; 
    a.m_restitution=null; 
    a.m_toi=null; 
    a.GetManifolds=function(){
	return null
    }; 
    a.GetManifoldCount=function(){
	return this.m_manifoldCount
    }; 

    a.IsSolid=function(){
	return(this.m_flags&b2.Contact.e_nonSolidFlag)==0
    }; 
    a.GetNext=function(){
	return this.m_next
    }; 
    a.GetShape1=function(){
	return this.m_shape1
    }; 
    a.GetShape2=function(){
	return this.m_shape2
    }; 
    a.Update=function(b){
	var c=this.m_manifoldCount; 
	this.Evaluate(b); 
	b=this.m_shape1.m_body; 
	var d=this.m_shape2.m_body; 
	if(this.m_manifoldCount==0&&c>0){
	    b.WakeUp(); 
	    d.WakeUp()}if(b.IsStatic()||b.IsBullet()||d.IsStatic()||d.IsBullet())this.m_flags&=~b2.Contact.e_slowFlag; 
	else this.m_flags|=b2.Contact.e_slowFlag
    }; 

    a.Evaluate=function(){
	
    }; 
    b2.DistanceJoint=function(){
	b2.Joint.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.DistanceJoint.prototype,b2.Joint.prototype); 
    a=b2.DistanceJoint.prototype; 
    a._super=function(){
	b2.Joint.prototype.__constructor.apply(this,arguments)
    }; 

    a.__constructor=function(b){
	this._super(b); 
	this.m_localAnchor1.SetV(b.localAnchor1); 
	this.m_localAnchor2.SetV(b.localAnchor2); 
	this.m_length=b.length; 
	this.m_frequencyHz=b.frequencyHz; 
	this.m_dampingRatio=b.dampingRatio; 
	this.m_inv_dt=this.m_bias=this.m_gamma=this.m_impulse=0
    }; 
    a.__varz=function(){
	this.m_localAnchor1=new b2.Vec2; 
	this.m_localAnchor2=new b2.Vec2; 
	this.m_u=new b2.Vec2
    }; 
    a.m_localAnchor1=new b2.Vec2; 
    a.m_localAnchor2=new b2.Vec2; 
    a.m_u=new b2.Vec2; 
    a.m_frequencyHz=null; 
    a.m_dampingRatio=null; 

    a.m_gamma=null; 
    a.m_bias=null; 
    a.m_impulse=null; 
    a.m_mass=null; 
    a.m_length=null; 

    a.InitVelocityConstraints=function(b){
	var c,d; 
	this.m_inv_dt=b.inv_dt; 
	var e=this.m_body1,f=this.m_body2; 
	c=e.m_xf.R; 
	var g=this.m_localAnchor1.x-e.m_sweep.localCenter.x,h=this.m_localAnchor1.y-e.m_sweep.localCenter.y; 
	d=c.col1.x*g+c.col2.x*h; 
	h=c.col1.y*g+c.col2.y*h; 
	g=d; 
	c=f.m_xf.R; 
	var i=this.m_localAnchor2.x-f.m_sweep.localCenter.x,j=this.m_localAnchor2.y-f.m_sweep.localCenter.y; 
	d=c.col1.x*i+c.col2.x*j; 
	j=c.col1.y*i+c.col2.y*j; 
	i=d; 
	this.m_u.x=f.m_sweep.c.x+i-e.m_sweep.c.x-g; 
	this.m_u.y=f.m_sweep.c.y+j-e.m_sweep.c.y-
	    h; 
	d=Math.sqrt(this.m_u.x*this.m_u.x+this.m_u.y*this.m_u.y); 
	d>b2.Settings.linearSlop?this.m_u.Multiply(1/d):this.m_u.SetZero(); 
	c=g*this.m_u.y-h*this.m_u.x; 
	var k=i*this.m_u.y-j*this.m_u.x; 
	c=e.m_invMass+e.m_invI*c*c+f.m_invMass+f.m_invI*k*k; 
	this.m_mass=1/c; 
	if(this.m_frequencyHz>0){
	    d=d-this.m_length; 
	    k=2*Math.PI*this.m_frequencyHz; 
	    var l=this.m_mass*k*k; 
	    this.m_gamma=1/(b.dt*(2*this.m_mass*this.m_dampingRatio*k+b.dt*l)); 
	    this.m_bias=d*b.dt*l*this.m_gamma; 
	    this.m_mass=1/(c+this.m_gamma)}if(b.warmStarting){
		this.m_impulse*=
		    b.dtRatio; 
		b=this.m_impulse*this.m_u.x; 
		c=this.m_impulse*this.m_u.y; 
		e.m_linearVelocity.x-=e.m_invMass*b; 
		e.m_linearVelocity.y-=e.m_invMass*c; 
		e.m_angularVelocity-=e.m_invI*(g*c-h*b); 
		f.m_linearVelocity.x+=f.m_invMass*b; 
		f.m_linearVelocity.y+=f.m_invMass*c; 
		f.m_angularVelocity+=f.m_invI*(i*c-j*b)}else this.m_impulse=0
    }; 

    a.SolveVelocityConstraints=function(){
	var b,c=this.m_body1,d=this.m_body2; 
	b=c.m_xf.R; 
	var e=this.m_localAnchor1.x-c.m_sweep.localCenter.x,f=this.m_localAnchor1.y-c.m_sweep.localCenter.y,g=b.col1.x*e+b.col2.x*f; 
	f=b.col1.y*e+b.col2.y*f; 
	e=g; 
	b=d.m_xf.R; 
	var h=this.m_localAnchor2.x-d.m_sweep.localCenter.x,i=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	g=b.col1.x*h+b.col2.x*i; 
	i=b.col1.y*h+b.col2.y*i; 
	h=g; 
	g=-this.m_mass*(this.m_u.x*(d.m_linearVelocity.x+-d.m_angularVelocity*i-(c.m_linearVelocity.x+-c.m_angularVelocity*
										 f))+this.m_u.y*(d.m_linearVelocity.y+d.m_angularVelocity*h-(c.m_linearVelocity.y+c.m_angularVelocity*e))+this.m_bias+this.m_gamma*this.m_impulse); 
	this.m_impulse+=g; 
	b=g*this.m_u.x; 
	g=g*this.m_u.y; 
	c.m_linearVelocity.x-=c.m_invMass*b; 
	c.m_linearVelocity.y-=c.m_invMass*g; 
	c.m_angularVelocity-=c.m_invI*(e*g-f*b); 
	d.m_linearVelocity.x+=d.m_invMass*b; 
	d.m_linearVelocity.y+=d.m_invMass*g; 
	d.m_angularVelocity+=d.m_invI*(h*g-i*b)
    }; 

    a.SolvePositionConstraints=function(){
	var b; 
	if(this.m_frequencyHz>0)return true; 
	var c=this.m_body1,d=this.m_body2; 
	b=c.m_xf.R; 
	var e=this.m_localAnchor1.x-c.m_sweep.localCenter.x,f=this.m_localAnchor1.y-c.m_sweep.localCenter.y,g=b.col1.x*e+b.col2.x*f; 
	f=b.col1.y*e+b.col2.y*f; 
	e=g; 
	b=d.m_xf.R; 
	var h=this.m_localAnchor2.x-d.m_sweep.localCenter.x,i=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	g=b.col1.x*h+b.col2.x*i; 
	i=b.col1.y*h+b.col2.y*i; 
	h=g; 
	g=d.m_sweep.c.x+h-c.m_sweep.c.x-e; 
	var j=d.m_sweep.c.y+i-c.m_sweep.c.y-
	    f; 
	b=Math.sqrt(g*g+j*j); 
	g/=b; 
	j/=b; 
	b=b-this.m_length; 
	b=b2.Math.Clamp(b,-b2.Settings.maxLinearCorrection,b2.Settings.maxLinearCorrection); 
	var k=-this.m_mass*b; 
	this.m_u.Set(g,j); 
	g=k*this.m_u.x; 
	j=k*this.m_u.y; 
	c.m_sweep.c.x-=c.m_invMass*g; 
	c.m_sweep.c.y-=c.m_invMass*j; 
	c.m_sweep.a-=c.m_invI*(e*j-f*g); 
	d.m_sweep.c.x+=d.m_invMass*g; 
	d.m_sweep.c.y+=d.m_invMass*j; 
	d.m_sweep.a+=d.m_invI*(h*j-i*g); 
	c.SynchronizeTransform(); 
	d.SynchronizeTransform(); 
	return b2.Math.Abs(b)<b2.Settings.linearSlop
    }; 

    a.GetAnchor1=function(){
	return this.m_body1.GetWorldPoint(this.m_localAnchor1)
    }; 
    a.GetAnchor2=function(){
	return this.m_body2.GetWorldPoint(this.m_localAnchor2)
    }; 
    a.GetReactionForce=function(){
	var b=new b2.Vec2; 
	b.SetV(this.m_u); 
	b.Multiply(this.m_inv_dt*this.m_impulse); 
	return b
    }; 
    a.GetReactionTorque=function(){
	return 0
    }; 
    b2.Body=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    b2.Body.prototype.__constructor=function(b,c){
	this.m_flags=0; 
	if(b.isBullet)this.m_flags|=b2.Body.e_bulletFlag; 
	if(b.fixedRotation)this.m_flags|=b2.Body.e_fixedRotationFlag; 
	if(b.allowSleep)this.m_flags|=b2.Body.e_allowSleepFlag; 
	if(b.isSleeping)this.m_flags|=b2.Body.e_sleepFlag; 
	this.m_world=c; 
	this.m_xf.position.SetV(b.position); 
	this.m_xf.R.Set(b.angle); 
	this.m_sweep.localCenter.SetV(b.massData.center); 
	this.m_sweep.t0=1; 
	this.m_sweep.a0=this.m_sweep.a=b.angle; 
	c=this.m_xf.R; 
	var d=this.m_sweep.localCenter; 
	this.m_sweep.c.x=
	    c.col1.x*d.x+c.col2.x*d.y; 
	this.m_sweep.c.y=c.col1.y*d.x+c.col2.y*d.y; 
	this.m_sweep.c.x+=this.m_xf.position.x; 
	this.m_sweep.c.y+=this.m_xf.position.y; 
	this.m_sweep.c0.SetV(this.m_sweep.c); 
	this.m_next=this.m_prev=this.m_contactList=this.m_jointList=null; 
	this.m_linearDamping=b.linearDamping; 
	this.m_angularDamping=b.angularDamping; 
	this.m_force.Set(0,0); 
	this.m_torque=0; 
	this.m_linearVelocity.SetZero(); 
	this.m_invI=this.m_I=this.m_invMass=this.m_sleepTime=this.m_angularVelocity=0; 
	this.m_mass=b.massData.mass; 

	if(this.m_mass>0)this.m_invMass=1/this.m_mass; 
	if((this.m_flags&b2.Body.e_fixedRotationFlag)==0)this.m_I=b.massData.I; 
	if(this.m_I>0)this.m_invI=1/this.m_I; 
	this.m_type=this.m_invMass==0&&this.m_invI==0?b2.Body.e_staticType:b2.Body.e_dynamicType; 
	this.m_userData=b.userData; 
	this.m_shapeList=null; 
	this.m_shapeCount=0
    }; 
    b2.Body.prototype.__varz=function(){
	this.m_xf=new b2.XForm; 
	this.m_sweep=new b2.Sweep; 
	this.m_linearVelocity=new b2.Vec2; 
	this.m_force=new b2.Vec2
    }; 
    b2.Body.e_frozenFlag=2; 
    b2.Body.e_islandFlag=4; 

    b2.Body.e_sleepFlag=8; 
    b2.Body.e_allowSleepFlag=16; 
    b2.Body.e_bulletFlag=32; 
    b2.Body.e_fixedRotationFlag=64; 
    b2.Body.e_staticType=1; 
    b2.Body.e_dynamicType=2; 
    b2.Body.e_maxTypes=3; 
    b2.Body.s_massData=new b2.MassData; 
    b2.Body.s_xf1=new b2.XForm; 
    a=b2.Body.prototype; 
    a.m_flags=0; 
    a.m_type=0; 
    a.m_xf=new b2.XForm; 
    a.m_sweep=new b2.Sweep; 
    a.m_linearVelocity=new b2.Vec2; 
    a.m_angularVelocity=null; 
    a.m_force=new b2.Vec2; 
    a.m_torque=null; 
    a.m_world=null; 
    a.m_prev=null; 
    a.m_next=null; 
    a.m_shapeList=null; 
    a.m_shapeCount=0; 
    a.m_jointList=null; 

    a.m_contactList=null; 
    a.m_mass=null; 
    a.m_invMass=null; 
    a.m_I=null; 
    a.m_invI=null; 
    a.m_linearDamping=null; 
    a.m_angularDamping=null; 
    a.m_sleepTime=null; 
    a.m_userData=null; 
    a.CreateShape=function(b){
	if(this.m_world.m_lock==true)return null; 
	b=b2.Shape.Create(b,this.m_world.m_blockAllocator); 
	b.m_next=this.m_shapeList; 
	this.m_shapeList=b; 
	++this.m_shapeCount; 
	b.m_body=this; 
	b.CreateProxy(this.m_world.m_broadPhase,this.m_xf); 
	b.UpdateSweepRadius(this.m_sweep.localCenter); 
	return b
    }; 

    a.DestroyShape=function(b){
	if(this.m_world.m_lock!=true){
	    b.DestroyProxy(this.m_world.m_broadPhase); 
	    for(var c=this.m_shapeList; 
		c!=null; 
	       ){
		if(c==b)break; 
		c=c.m_next}b.m_body=null; 
	    b.m_next=null; 
	    --this.m_shapeCount; 
	    b2.Shape.Destroy(b,this.m_world.m_blockAllocator)}
    }; 

    a.SetMass=function(b){
	if(this.m_world.m_lock!=true){
	    this.m_invI=this.m_I=this.m_invMass=0; 
	    this.m_mass=b.mass; 
	    if(this.m_mass>0)this.m_invMass=1/this.m_mass; 
	    if((this.m_flags&b2.Body.e_fixedRotationFlag)==0)this.m_I=b.I; 
	    if(this.m_I>0)this.m_invI=1/this.m_I; 
	    this.m_sweep.localCenter.SetV(b.center); 
	    b=this.m_xf.R; 
	    var c=this.m_sweep.localCenter; 
	    this.m_sweep.c.x=b.col1.x*c.x+b.col2.x*c.y; 
	    this.m_sweep.c.y=b.col1.y*c.x+b.col2.y*c.y; 
	    this.m_sweep.c.x+=this.m_xf.position.x; 
	    this.m_sweep.c.y+=this.m_xf.position.y; 

	    this.m_sweep.c0.SetV(this.m_sweep.c); 
	    for(b=this.m_shapeList; 
		b; 
		b=b.m_next)b.UpdateSweepRadius(this.m_sweep.localCenter); 
	    b=this.m_type; 
	    this.m_type=this.m_invMass==0&&this.m_invI==0?b2.Body.e_staticType:b2.Body.e_dynamicType; 
	    if(b!=this.m_type)for(b=this.m_shapeList; 
				  b; 
				  b=b.m_next)b.RefilterProxy(this.m_world.m_broadPhase,this.m_xf)}
    }; 

    a.SetMassFromShapes=function(){
	var b; 
	if(this.m_world.m_lock!=true){
	    var c=this.m_invI=this.m_I=this.m_invMass=this.m_mass=0,d=0,e=b2.Body.s_massData; 
	    for(b=this.m_shapeList; 
		b; 
		b=b.m_next){
		b.ComputeMass(e); 
		this.m_mass+=e.mass; 
		c+=e.mass*e.center.x; 
		d+=e.mass*e.center.y; 
		this.m_I+=e.I}if(this.m_mass>0){
		    this.m_invMass=1/this.m_mass; 
		    c*=this.m_invMass; 
		    d*=this.m_invMass}if(this.m_I>0&&(this.m_flags&b2.Body.e_fixedRotationFlag)==0){
			this.m_I-=this.m_mass*(c*c+d*d); 
			this.m_invI=1/this.m_I}else this.m_invI=this.m_I=
		0; 
	    this.m_sweep.localCenter.Set(c,d); 
	    b=this.m_xf.R; 
	    c=this.m_sweep.localCenter; 
	    this.m_sweep.c.x=b.col1.x*c.x+b.col2.x*c.y; 
	    this.m_sweep.c.y=b.col1.y*c.x+b.col2.y*c.y; 
	    this.m_sweep.c.x+=this.m_xf.position.x; 
	    this.m_sweep.c.y+=this.m_xf.position.y; 
	    this.m_sweep.c0.SetV(this.m_sweep.c); 
	    for(b=this.m_shapeList; 
		b; 
		b=b.m_next)b.UpdateSweepRadius(this.m_sweep.localCenter); 
	    b=this.m_type; 
	    this.m_type=this.m_invMass==0&&this.m_invI==0?b2.Body.e_staticType:b2.Body.e_dynamicType; 
	    if(b!=this.m_type)for(b=this.m_shapeList; 
				  b; 
				  b=
				  b.m_next)b.RefilterProxy(this.m_world.m_broadPhase,this.m_xf)}
    }; 

    a.SetXForm=function(b,c){
	if(this.m_world.m_lock==true)return true; 
	if(this.IsFrozen())return false; 
	this.m_xf.R.Set(c); 
	this.m_xf.position.SetV(b); 
	b=this.m_xf.R; 
	var d=this.m_sweep.localCenter; 
	this.m_sweep.c.x=b.col1.x*d.x+b.col2.x*d.y; 
	this.m_sweep.c.y=b.col1.y*d.x+b.col2.y*d.y; 
	this.m_sweep.c.x+=this.m_xf.position.x; 
	this.m_sweep.c.y+=this.m_xf.position.y; 
	this.m_sweep.c0.SetV(this.m_sweep.c); 
	this.m_sweep.a0=this.m_sweep.a=c; 
	b=false; 
	for(c=this.m_shapeList; 
	    c; 
	    c=c.m_next)if(c.Synchronize(this.m_world.m_broadPhase,
					this.m_xf,this.m_xf)==false){
		b=true; 
		break}if(b==true){
		    this.m_flags|=b2.Body.e_frozenFlag; 
		    this.m_linearVelocity.SetZero(); 
		    this.m_angularVelocity=0; 
		    for(c=this.m_shapeList; 
			c; 
			c=c.m_next)c.DestroyProxy(this.m_world.m_broadPhase); 
		    return false}this.m_world.m_broadPhase.Commit(); 
	return true
    }; 
    a.GetXForm=function(){
	return this.m_xf
    }; 
    a.GetPosition=function(){
	return this.m_xf.position
    }; 
    a.GetAngle=function(){
	return this.m_sweep.a
    }; 
    a.GetWorldCenter=function(){
	return this.m_sweep.c
    }; 
    a.GetLocalCenter=function(){
	return this.m_sweep.localCenter
    }; 

    a.SetLinearVelocity=function(b){
	this.m_linearVelocity.SetV(b)
    }; 
    a.GetLinearVelocity=function(){
	return this.m_linearVelocity
    }; 
    a.SetAngularVelocity=function(b){
	this.m_angularVelocity=b
    }; 
    a.GetAngularVelocity=function(){
	return this.m_angularVelocity
    }; 
    a.ApplyForce=function(b,c){
	this.IsSleeping()&&this.WakeUp(); 
	this.m_force.x+=b.x; 
	this.m_force.y+=b.y; 
	this.m_torque+=(c.x-this.m_sweep.c.x)*b.y-(c.y-this.m_sweep.c.y)*b.x
    }; 
    a.ApplyTorque=function(b){
	this.IsSleeping()&&this.WakeUp(); 
	this.m_torque+=b
    }; 

    a.ApplyImpulse=function(b,c){
	this.IsSleeping()&&this.WakeUp(); 
	this.m_linearVelocity.x+=this.m_invMass*b.x; 
	this.m_linearVelocity.y+=this.m_invMass*b.y; 
	this.m_angularVelocity+=this.m_invI*((c.x-this.m_sweep.c.x)*b.y-(c.y-this.m_sweep.c.y)*b.x)
    }; 
    a.GetMass=function(){
	return this.m_mass
    }; 
    a.GetInertia=function(){
	return this.m_I
    }; 
    a.GetWorldPoint=function(b){
	var c=this.m_xf.R; 
	b=new b2.Vec2(c.col1.x*b.x+c.col2.x*b.y,c.col1.y*b.x+c.col2.y*b.y); 
	b.x+=this.m_xf.position.x; 
	b.y+=this.m_xf.position.y; 
	return b
    }; 

    a.GetWorldVector=function(b){
	return b2.Math.MulMV(this.m_xf.R,b)
    }; 
    a.GetLocalPoint=function(b){
	return b2.Math.MulXT(this.m_xf,b)
    }; 
    a.GetLocalVector=function(b){
	return b2.Math.MulTMV(this.m_xf.R,b)
    }; 
    a.GetLinearVelocityFromWorldPoint=function(b){
	return new b2.Vec2(this.m_linearVelocity.x+this.m_angularVelocity*(b.y-this.m_sweep.c.y),this.m_linearVelocity.x-this.m_angularVelocity*(b.x-this.m_sweep.c.x))
    }; 

    a.GetLinearVelocityFromLocalPoint=function(b){
	var c=this.m_xf.R; 
	b=new b2.Vec2(c.col1.x*b.x+c.col2.x*b.y,c.col1.y*b.x+c.col2.y*b.y); 
	b.x+=this.m_xf.position.x; 
	b.y+=this.m_xf.position.y; 
	return new b2.Vec2(this.m_linearVelocity.x+this.m_angularVelocity*(b.y-this.m_sweep.c.y),this.m_linearVelocity.x-this.m_angularVelocity*(b.x-this.m_sweep.c.x))
    }; 
    a.IsBullet=function(){
	return(this.m_flags&b2.Body.e_bulletFlag)==b2.Body.e_bulletFlag
    }; 

    a.SetBullet=function(b){
	if(b)this.m_flags|=b2.Body.e_bulletFlag; 
	else this.m_flags&=~b2.Body.e_bulletFlag
    }; 
    a.IsStatic=function(){
	return this.m_type==b2.Body.e_staticType
    }; 
    a.IsDynamic=function(){
	return this.m_type==b2.Body.e_dynamicType
    }; 
    a.IsFrozen=function(){
	return(this.m_flags&b2.Body.e_frozenFlag)==b2.Body.e_frozenFlag
    }; 
    a.IsSleeping=function(){
	return(this.m_flags&b2.Body.e_sleepFlag)==b2.Body.e_sleepFlag
    }; 

    a.AllowSleeping=function(b){
	if(b)this.m_flags|=b2.Body.e_allowSleepFlag; 
	else{
	    this.m_flags&=~b2.Body.e_allowSleepFlag; 
	    this.WakeUp()}
    }; 
    a.WakeUp=function(){
	this.m_flags&=~b2.Body.e_sleepFlag; 
	this.m_sleepTime=0
    }; 
    a.PutToSleep=function(){
	this.m_flags|=b2.Body.e_sleepFlag; 
	this.m_sleepTime=0; 
	this.m_linearVelocity.SetZero(); 
	this.m_angularVelocity=0; 
	this.m_force.SetZero(); 
	this.m_torque=0
    }; 
    a.GetShapeList=function(){
	return this.m_shapeList
    }; 
    a.GetJointList=function(){
	return this.m_jointList
    }; 
    a.GetNext=function(){
	return this.m_next
    }; 

    a.GetUserData=function(){
	return this.m_userData
    }; 
    a.SetUserData=function(b){
	this.m_userData=b
    }; 
    a.GetWorld=function(){
	return this.m_world
    }; 

    a.SynchronizeShapes=function(){
	var b=b2.Body.s_xf1; 
	b.R.Set(this.m_sweep.a0); 
	var c=b.R,d=this.m_sweep.localCenter; 
	b.position.x=this.m_sweep.c0.x-(c.col1.x*d.x+c.col2.x*d.y); 
	b.position.y=this.m_sweep.c0.y-(c.col1.y*d.x+c.col2.y*d.y); 
	d=true; 
	for(c=this.m_shapeList; 
	    c; 
	    c=c.m_next){
	    d=c.Synchronize(this.m_world.m_broadPhase,b,this.m_xf); 
	    if(d==false)break}if(d==false){
		this.m_flags|=b2.Body.e_frozenFlag; 
		this.m_linearVelocity.SetZero(); 
		this.m_angularVelocity=0; 
		for(c=this.m_shapeList; 
		    c; 
		    c=c.m_next)c.DestroyProxy(this.m_world.m_broadPhase); 

		return false}return true
    }; 
    a.SynchronizeTransform=function(){
	this.m_xf.R.Set(this.m_sweep.a); 
	var b=this.m_xf.R,c=this.m_sweep.localCenter; 
	this.m_xf.position.x=this.m_sweep.c.x-(b.col1.x*c.x+b.col2.x*c.y); 
	this.m_xf.position.y=this.m_sweep.c.y-(b.col1.y*c.x+b.col2.y*c.y)
    }; 
    a.IsConnected=function(b){
	for(var c=this.m_jointList; 
	    c; 
	    c=c.next)if(c.other==b)return c.joint.m_collideConnected==false; 
	return false
    }; 

    a.Advance=function(b){
	this.m_sweep.Advance(b); 
	this.m_sweep.c.SetV(this.m_sweep.c0); 
	this.m_sweep.a=this.m_sweep.a0; 
	this.SynchronizeTransform()
    }; 
    b2.ContactFilter=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.ContactFilter.prototype.__constructor=function(){
	
    }; 
    b2.ContactFilter.prototype.__varz=function(){
	
    }; 
    b2.ContactFilter.defaultFilter=new b2.ContactFilter; 
    b2.ContactFilter.prototype.ShouldCollide=function(b,c){
	b=b.GetFilterData(); 
	c=c.GetFilterData(); 
	if(b.groupIndex==c.groupIndex&&b.groupIndex!=0)return b.groupIndex>0; 
	return(b.maskBits&c.categoryBits)!=0&&(b.categoryBits&c.maskBits)!=0
    }; 

    b2.ContactFilter.prototype.RayCollide=function(b,c){
	if(!b)return true; 
	return this.ShouldCollide(b,c)
    }; 
    b2.PolygonShape=function(){
	b2.Shape.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PolygonShape.prototype,b2.Shape.prototype); 
    b2.PolygonShape.prototype._super=function(){
	b2.Shape.prototype.__constructor.apply(this,arguments)
    }; 

    b2.PolygonShape.prototype.__constructor=function(b){
	this._super(b); 
	this.m_type=b2.Shape.e_polygonShape; 
	this.m_vertexCount=b.vertexCount; 
	var c=0,d=c,e=c; 
	for(c=0; 
	    c<this.m_vertexCount; 
	    ++c)this.m_vertices[c]=b.vertices[c].Copy(); 
	for(c=0; 
	    c<this.m_vertexCount; 
	    ++c){
	    d=c; 
	    e=c+1<this.m_vertexCount?c+1:0; 
	    var f=this.m_vertices[e].x-this.m_vertices[d].x; 
	    d=this.m_vertices[e].y-this.m_vertices[d].y; 
	    e=Math.sqrt(f*f+d*d); 
	    this.m_normals[c]=new b2.Vec2(d/e,-f/e)}this.m_centroid=b2.PolygonShape.ComputeCentroid(b.vertices,
												    b.vertexCount); 
	b2.PolygonShape.ComputeOBB(this.m_obb,this.m_vertices,this.m_vertexCount); 
	for(c=0; 
	    c<this.m_vertexCount; 
	    ++c){
	    d=c-1>=0?c-1:this.m_vertexCount-1; 
	    e=c; 
	    b=this.m_normals[d].x; 
	    f=this.m_normals[d].y; 
	    d=this.m_normals[e].x; 
	    e=this.m_normals[e].y; 
	    var g=this.m_vertices[c].x-this.m_centroid.x,h=this.m_vertices[c].y-this.m_centroid.y,i=b*g+f*h-b2.Settings.toiSlop; 
	    g=d*g+e*h-b2.Settings.toiSlop; 
	    h=1/(b*e-f*d); 
	    this.m_coreVertices[c]=new b2.Vec2(h*(e*i-f*g)+this.m_centroid.x,h*(b*g-d*i)+this.m_centroid.y)}
    }; 

    b2.PolygonShape.prototype.__varz=function(){
	this.s_supportVec=new b2.Vec2; 
	this.m_obb=new b2.OBB; 
	this.m_vertices=new Array(b2.Settings.maxPolygonVertices); 
	this.m_normals=new Array(b2.Settings.maxPolygonVertices); 
	this.m_coreVertices=new Array(b2.Settings.maxPolygonVertices)
    }; 
    b2.PolygonShape.s_computeMat=new b2.Mat22; 
    b2.PolygonShape.s_sweptAABB1=new b2.AABB; 
    b2.PolygonShape.s_sweptAABB2=new b2.AABB; 

    b2.PolygonShape.ComputeCentroid=function(b,c){
	for(var d=new b2.Vec2,e=0,f=1/3,g=0; 
	    g<c; 
	    ++g){
	    var h=b[g],i=g+1<c?b[parseInt(g+1)]:b[0],j=0.5*((h.x-0)*(i.y-0)-(h.y-0)*(i.x-0)); 
	    e+=j; 
	    d.x+=j*f*(0+h.x+i.x); 
	    d.y+=j*f*(0+h.y+i.y)}d.x*=1/e; 
	d.y*=1/e; 
	return d
    }; 

    b2.PolygonShape.ComputeOBB=function(b,c,d){
	var e=0,f=new Array(b2.Settings.maxPolygonVertices+1); 
	for(e=0; 
	    e<d; 
	    ++e)f[e]=c[e]; 
	f[d]=f[0]; 
	c=Number.MAX_VALUE; 
	for(e=1; 
	    e<=d; 
	    ++e){
	    var g=f[parseInt(e-1)],h=f[e].x-g.x,i=f[e].y-g.y,j=Math.sqrt(h*h+i*i); 
	    h/=j; 
	    i/=j; 
	    for(var k=-i,l=h,m=j=Number.MAX_VALUE,n=-Number.MAX_VALUE,o=-Number.MAX_VALUE,q=0; 
		q<d; 
		++q){
		var r=f[q].x-g.x,s=f[q].y-g.y,v=h*r+i*s; 
		r=k*r+l*s; 
		if(v<j)j=v; 
		if(r<m)m=r; 
		if(v>n)n=v; 
		if(r>o)o=r}q=(n-j)*(o-m); 
	    if(q<0.95*c){
		c=q; 
		b.R.col1.x=h; 
		b.R.col1.y=i; 
		b.R.col2.x=
		    k; 
		b.R.col2.y=l; 
		h=0.5*(j+n); 
		i=0.5*(m+o); 
		k=b.R; 
		b.center.x=g.x+(k.col1.x*h+k.col2.x*i); 
		b.center.y=g.y+(k.col1.y*h+k.col2.y*i); 
		b.extents.x=0.5*(n-j); 
		b.extents.y=0.5*(o-m)}}
    }; 
    a=b2.PolygonShape.prototype; 
    a.s_supportVec=new b2.Vec2; 
    a.m_centroid=null; 
    a.m_obb=new b2.OBB; 
    a.m_vertices=new Array(b2.Settings.maxPolygonVertices); 
    a.m_normals=new Array(b2.Settings.maxPolygonVertices); 
    a.m_coreVertices=new Array(b2.Settings.maxPolygonVertices); 
    a.m_vertexCount=0; 

    a.TestPoint=function(b,c){
	var d; 
	d=b.R; 
	var e=c.x-b.position.x; 
	b=c.y-b.position.y; 
	c=e*d.col1.x+b*d.col1.y; 
	for(var f=e*d.col2.x+b*d.col2.y,g=0; 
	    g<this.m_vertexCount; 
	    ++g){
	    d=this.m_vertices[g]; 
	    e=c-d.x; 
	    b=f-d.y; 
	    d=this.m_normals[g]; 
	    if(d.x*e+d.y*b>0)return false}return true
    }; 

    a.TestSegment=function(b,c,d,e,f){
	var g=0; 
	f=f; 
	var h,i,j,k; 
	h=e.p1.x-b.position.x; 
	i=e.p1.y-b.position.y; 
	j=b.R; 
	var l=h*j.col1.x+i*j.col1.y,m=h*j.col2.x+i*j.col2.y; 
	h=e.p2.x-b.position.x; 
	i=e.p2.y-b.position.y; 
	j=b.R; 
	e=h*j.col1.x+i*j.col1.y-l; 
	j=h*j.col2.x+i*j.col2.y-m; 
	for(var n=-1,o=0; 
	    o<this.m_vertexCount; 
	    ++o){
	    k=this.m_vertices[o]; 
	    h=k.x-l; 
	    i=k.y-m; 
	    k=this.m_normals[o]; 
	    h=k.x*h+k.y*i; 
	    i=k.x*e+k.y*j; 
	    if(i<0&&h<g*i){
		g=h/i; 
		n=o}else if(i>0&&h<f*i)f=h/i; 
	    if(f<g)return b2.Shape.e_missCollide}if(n>=0){
		c[0]=g; 
		j=b.R; 
		k=this.m_normals[n]; 

		d.x=j.col1.x*k.x+j.col2.x*k.y; 
		d.y=j.col1.y*k.x+j.col2.y*k.y; 
		return b2.Shape.e_hitCollide}c[0]=0; 
	return b2.Shape.e_startsInsideCollide
    }; 

    a.ComputeAABB=function(b,c){
	var d,e,f=b2.PolygonShape.s_computeMat; 
	d=c.R; 
	e=this.m_obb.R.col1; 
	f.col1.x=d.col1.x*e.x+d.col2.x*e.y; 
	f.col1.y=d.col1.y*e.x+d.col2.y*e.y; 
	e=this.m_obb.R.col2; 
	f.col2.x=d.col1.x*e.x+d.col2.x*e.y; 
	f.col2.y=d.col1.y*e.x+d.col2.y*e.y; 
	f.Abs(); 
	e=this.m_obb.extents; 
	var g=f.col1.x*e.x+f.col2.x*e.y; 
	f=f.col1.y*e.x+f.col2.y*e.y; 
	d=c.R; 
	e=this.m_obb.center; 
	var h=c.position.x+(d.col1.x*e.x+d.col2.x*e.y); 
	c=c.position.y+(d.col1.y*e.x+d.col2.y*e.y); 
	b.lowerBound.Set(h-g,c-f); 
	b.upperBound.Set(h+
			 g,c+f)
    }; 
    a.ComputeSweptAABB=function(b,c,d){
	var e=b2.PolygonShape.s_sweptAABB1,f=b2.PolygonShape.s_sweptAABB2; 
	this.ComputeAABB(e,c); 
	this.ComputeAABB(f,d); 
	b.lowerBound.Set(e.lowerBound.x<f.lowerBound.x?e.lowerBound.x:f.lowerBound.x,e.lowerBound.y<f.lowerBound.y?e.lowerBound.y:f.lowerBound.y); 
	b.upperBound.Set(e.upperBound.x>f.upperBound.x?e.upperBound.x:f.upperBound.x,e.upperBound.y>f.upperBound.y?e.upperBound.y:f.upperBound.y)
    }; 

    a.ComputeMass=function(b){
	for(var c=0,d=0,e=0,f=0,g=1/3,h=0; 
	    h<this.m_vertexCount; 
	    ++h){
	    var i=this.m_vertices[h],j=h+1<this.m_vertexCount?this.m_vertices[parseInt(h+1)]:this.m_vertices[0],k=i.x-0,l=i.y-0,m=j.x-0,n=j.y-0,o=k*n-l*m,q=0.5*o; 
	    e+=q; 
	    c+=q*g*(0+i.x+j.x); 
	    d+=q*g*(0+i.y+j.y); 
	    f+=o*(g*(0.25*(k*k+m*k+m*m)+(0*k+0*m))+0+(g*(0.25*(l*l+n*l+n*n)+(0*l+0*n))+0))}b.mass=this.m_density*e; 
	c*=1/e; 
	d*=1/e; 
	b.center.Set(c,d); 
	b.I=this.m_density*f
    }; 
    a.GetOBB=function(){
	return this.m_obb
    }; 
    a.GetCentroid=function(){
	return this.m_centroid
    }; 

    a.GetVertexCount=function(){
	return this.m_vertexCount
    }; 
    a.GetVertices=function(){
	return this.m_vertices
    }; 
    a.GetCoreVertices=function(){
	return this.m_coreVertices
    }; 
    a.GetNormals=function(){
	return this.m_normals
    }; 
    a.GetFirstVertex=function(b){
	return b2.Math.MulX(b,this.m_coreVertices[0])
    }; 
    a.Centroid=function(b){
	return b2.Math.MulX(b,this.m_centroid)
    }; 

    a.Support=function(b,c,d){
	var e; 
	e=b.R; 
	var f=c*e.col1.x+d*e.col1.y; 
	e=c*e.col2.x+d*e.col2.y; 
	c=0; 
	d=this.m_coreVertices[0]; 
	for(var g=d.x*f+d.y*e,h=1; 
	    h<this.m_vertexCount; 
	    ++h){
	    d=this.m_coreVertices[h]; 
	    d=d.x*f+d.y*e; 
	    if(d>g){
		c=h; 
		g=d}}e=b.R; 
	d=this.m_coreVertices[c]; 
	this.s_supportVec.x=b.position.x+(e.col1.x*d.x+e.col2.x*d.y); 
	this.s_supportVec.y=b.position.y+(e.col1.y*d.x+e.col2.y*d.y); 
	return this.s_supportVec
    }; 

    a.UpdateSweepRadius=function(b){
	var c; 
	for(var d=this.m_sweepRadius=0; 
	    d<this.m_vertexCount; 
	    ++d){
	    c=this.m_coreVertices[d]; 
	    var e=c.x-b.x; 
	    c=c.y-b.y; 
	    e=Math.sqrt(e*e+c*c); 
	    if(e>this.m_sweepRadius)this.m_sweepRadius=e}
    }; 
    b2.ContactResult=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactResult.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.position=new b2.Vec2; 
	this.normal=new b2.Vec2; 
	this.id=new b2.ContactID
    }; 
    a.shape1=null; 
    a.shape2=null; 
    a.position=new b2.Vec2; 
    a.normal=new b2.Vec2; 
    a.normalImpulse=null; 
    a.tangentImpulse=null; 
    a.id=new b2.ContactID; 
    b2.Island=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    b2.Island.prototype.__constructor=function(b,c,d,e,f){
	var g=0; 
	this.m_bodyCapacity=b; 
	this.m_contactCapacity=c; 
	this.m_jointCapacity=d; 
	this.m_jointCount=this.m_contactCount=this.m_bodyCount=0; 
	this.m_allocator=e; 
	this.m_listener=f; 
	this.m_bodies=new Array(b); 
	for(g=0; 
	    g<b; 
	    g++)this.m_bodies[g]=null; 
	this.m_contacts=new Array(c); 
	for(g=0; 
	    g<c; 
	    g++)this.m_contacts[g]=null; 
	this.m_joints=new Array(d); 
	for(g=0; 
	    g<d; 
	    g++)this.m_joints[g]=null; 
	this.m_positionIterationCount=0
    }; 
    b2.Island.prototype.__varz=function(){
	
    }; 

    b2.Island.s_reportCR=new b2.ContactResult; 
    a=b2.Island.prototype; 
    a.m_allocator=null; 
    a.m_listener=null; 
    a.m_bodies=null; 
    a.m_contacts=null; 
    a.m_joints=null; 
    a.m_bodyCount=0; 
    a.m_jointCount=0; 
    a.m_contactCount=0; 
    a.m_bodyCapacity=0; 
    a.m_contactCapacity=0; 
    a.m_jointCapacity=0; 
    a.m_positionIterationCount=0; 
    a.Clear=function(){
	this.m_jointCount=this.m_contactCount=this.m_bodyCount=0
    }; 

    a.Solve=function(b,c,d,e){
	var f=0,g; 
	for(f=0; 
	    f<this.m_bodyCount; 
	    ++f){
	    g=this.m_bodies[f]; 
	    if(!g.IsStatic()){
		g.m_linearVelocity.x+=b.dt*(c.x+g.m_invMass*g.m_force.x); 
		g.m_linearVelocity.y+=b.dt*(c.y+g.m_invMass*g.m_force.y); 
		g.m_angularVelocity+=b.dt*g.m_invI*g.m_torque; 
		g.m_force.SetZero(); 
		g.m_torque=0; 
		g.m_linearVelocity.Multiply(b2.Math.Clamp(1-b.dt*g.m_linearDamping,0,1)); 
		g.m_angularVelocity*=b2.Math.Clamp(1-b.dt*g.m_angularDamping,0,1); 
		if(g.m_linearVelocity.LengthSquared()>b2.Settings.maxLinearVelocitySquared){
		    g.m_linearVelocity.Normalize(); 

		    g.m_linearVelocity.x*=b2.Settings.maxLinearVelocity; 
		    g.m_linearVelocity.y*=b2.Settings.maxLinearVelocity}if(g.m_angularVelocity*g.m_angularVelocity>b2.Settings.maxAngularVelocitySquared)g.m_angularVelocity=g.m_angularVelocity<0?-b2.Settings.maxAngularVelocity:b2.Settings.maxAngularVelocity}}c=new b2.ContactSolver(b,this.m_contacts,this.m_contactCount,this.m_allocator); 
	c.InitVelocityConstraints(b); 
	for(f=0; 
	    f<this.m_jointCount; 
	    ++f){
	    g=this.m_joints[f]; 
	    g.InitVelocityConstraints(b)}for(f=0; 
					     f<b.maxIterations; 
					     ++f){
		c.SolveVelocityConstraints(); 

		for(var h=0; 
		    h<this.m_jointCount; 
		    ++h){
		    g=this.m_joints[h]; 
		    g.SolveVelocityConstraints(b)}}c.FinalizeVelocityConstraints(); 
	for(f=0; 
	    f<this.m_bodyCount; 
	    ++f){
	    g=this.m_bodies[f]; 
	    if(!g.IsStatic()){
		g.m_sweep.c0.SetV(g.m_sweep.c); 
		g.m_sweep.a0=g.m_sweep.a; 
		g.m_sweep.c.x+=b.dt*g.m_linearVelocity.x; 
		g.m_sweep.c.y+=b.dt*g.m_linearVelocity.y; 
		g.m_sweep.a+=b.dt*g.m_angularVelocity; 
		g.SynchronizeTransform()}}if(d){
		    for(f=0; 
			f<this.m_jointCount; 
			++f){
			g=this.m_joints[f]; 
			g.InitPositionConstraints()}for(this.m_positionIterationCount=
							0; 
							this.m_positionIterationCount<b.maxIterations; 
							++this.m_positionIterationCount){
			    d=c.SolvePositionConstraints(b2.Settings.contactBaumgarte); 
			    h=true; 
			    for(f=0; 
				f<this.m_jointCount; 
				++f){
				g=this.m_joints[f]; 
				g=g.SolvePositionConstraints(); 
				h=h&&g}if(d&&h)break}}this.Report(c.m_constraints); 
	if(e){
	    e=Number.MAX_VALUE; 
	    c=b2.Settings.linearSleepTolerance*b2.Settings.linearSleepTolerance; 
	    d=b2.Settings.angularSleepTolerance*b2.Settings.angularSleepTolerance; 
	    for(f=0; 
		f<this.m_bodyCount; 
		++f){
		g=this.m_bodies[f]; 

		if(g.m_invMass!=0){
		    if((g.m_flags&b2.Body.e_allowSleepFlag)==0)e=g.m_sleepTime=0; 
		    if((g.m_flags&b2.Body.e_allowSleepFlag)==0||g.m_angularVelocity*g.m_angularVelocity>d||b2.Math.Dot(g.m_linearVelocity,g.m_linearVelocity)>c)e=g.m_sleepTime=0; 
		    else{
			g.m_sleepTime+=b.dt; 
			e=b2.Math.Min(e,g.m_sleepTime)}}}if(e>=b2.Settings.timeToSleep)for(f=0; 
											   f<this.m_bodyCount; 
											   ++f){
			    g=this.m_bodies[f]; 
			    g.m_flags|=b2.Body.e_sleepFlag; 
			    g.m_linearVelocity.SetZero(); 
			    g.m_angularVelocity=0}}
    }; 

    a.SolveTOI=function(b){
	var c=0,d=new b2.ContactSolver(b,this.m_contacts,this.m_contactCount,this.m_allocator); 
	for(c=0; 
	    c<b.maxIterations; 
	    ++c)d.SolveVelocityConstraints(); 
	for(c=0; 
	    c<this.m_bodyCount; 
	    ++c){
	    var e=this.m_bodies[c]; 
	    if(!e.IsStatic()){
		e.m_sweep.c0.SetV(e.m_sweep.c); 
		e.m_sweep.a0=e.m_sweep.a; 
		e.m_sweep.c.x+=b.dt*e.m_linearVelocity.x; 
		e.m_sweep.c.y+=b.dt*e.m_linearVelocity.y; 
		e.m_sweep.a+=b.dt*e.m_angularVelocity; 
		e.SynchronizeTransform()}}for(c=0; 
					      c<b.maxIterations; 
					      ++c)if(d.SolvePositionConstraints(0.75))break; 

	this.Report(d.m_constraints)
    }; 

    a.Report=function(b){
	if(this.m_listener!=null)for(var c=0; 
				     c<this.m_contactCount; 
				     ++c){
	    var d=this.m_contacts[c],e=b[c],f=b2.Island.s_reportCR; 
	    f.shape1=d.m_shape1; 
	    f.shape2=d.m_shape2; 
	    var g=f.shape1.m_body,h=d.m_manifoldCount; 
	    d=d.GetManifolds(); 
	    for(var i=0; 
		i<h; 
		++i){
		var j=d[i]; 
		f.normal.SetV(j.normal); 
		for(var k=0; 
		    k<j.pointCount; 
		    ++k){
		    var l=j.points[k],m=e.points[k]; 
		    f.position=g.GetWorldPoint(l.localPoint1); 
		    f.normalImpulse=m.normalImpulse; 
		    f.tangentImpulse=m.tangentImpulse; 
		    f.id.key=l.id.key; 
		    this.m_listener.Result(f)}}}
    }; 

    a.AddBody=function(b){
	this.m_bodies[this.m_bodyCount++]=b
    }; 
    a.AddContact=function(b){
	this.m_contacts[this.m_contactCount++]=b
    }; 
    a.AddJoint=function(b){
	this.m_joints[this.m_jointCount++]=b
    }; 
    b2.ManifoldPoint=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ManifoldPoint.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.localPoint1=new b2.Vec2; 
	this.localPoint2=new b2.Vec2; 
	this.id=new b2.ContactID
    }; 
    a.localPoint1=new b2.Vec2; 
    a.localPoint2=new b2.Vec2; 
    a.separation=null; 
    a.normalImpulse=null; 
    a.tangentImpulse=null; 
    a.id=new b2.ContactID; 

    a.Reset=function(){
	this.localPoint1.SetZero(); 
	this.localPoint2.SetZero(); 
	this.tangentImpulse=this.normalImpulse=this.separation=0; 
	this.id.key=0
    }; 
    a.Set=function(b){
	this.localPoint1.SetV(b.localPoint1); 
	this.localPoint2.SetV(b.localPoint2); 
	this.separation=b.separation; 
	this.normalImpulse=b.normalImpulse; 
	this.tangentImpulse=b.tangentImpulse; 
	this.id.key=b.id.key
    }; 
    b2.Math=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    b2.Math.prototype.__constructor=function(){
	
    }; 
    b2.Math.prototype.__varz=function(){
	
    }; 
    b2.Math.Vec2_zero=new b2.Vec2(0,0); 
    b2.Math.Mat22_identity=new b2.Mat22(0,new b2.Vec2(1,0),new b2.Vec2(0,1)); 
    b2.Math.XForm_identity=new b2.XForm(b2.Math.Vec2_zero,b2.Math.Mat22_identity); 
    b2.Math.IsValid=function(b){
	return isFinite(b)
    }; 
    b2.Math.Dot=function(b,c){
	return b.x*c.x+b.y*c.y
    }; 
    b2.Math.CrossVV=function(b,c){
	return b.x*c.y-b.y*c.x
    }; 

    b2.Math.CrossVF=function(b,c){
	return new b2.Vec2(c*b.y,-c*b.x)
    }; 
    b2.Math.CrossFV=function(b,c){
	return new b2.Vec2(-b*c.y,b*c.x)
    }; 
    b2.Math.MulMV=function(b,c){
	return new b2.Vec2(b.col1.x*c.x+b.col2.x*c.y,b.col1.y*c.x+b.col2.y*c.y)
    }; 
    b2.Math.MulTMV=function(b,c){
	return new b2.Vec2(b2.Math.Dot(c,b.col1),b2.Math.Dot(c,b.col2))
    }; 
    b2.Math.MulX=function(b,c){
	c=b2.Math.MulMV(b.R,c); 
	c.x+=b.position.x; 
	c.y+=b.position.y; 
	return c
    }; 

    b2.Math.MulXT=function(b,c){
	c=b2.Math.SubtractVV(c,b.position); 
	var d=c.x*b.R.col1.x+c.y*b.R.col1.y; 
	c.y=c.x*b.R.col2.x+c.y*b.R.col2.y; 
	c.x=d; 
	return c
    }; 
    b2.Math.AddVV=function(b,c){
	return new b2.Vec2(b.x+c.x,b.y+c.y)
    }; 
    b2.Math.SubtractVV=function(b,c){
	return new b2.Vec2(b.x-c.x,b.y-c.y)
    }; 
    b2.Math.Distance=function(b,c){
	var d=b.x-c.x; 
	b=b.y-c.y; 
	return Math.sqrt(d*d+b*b)
    }; 
    b2.Math.DistanceSquared=function(b,c){
	var d=b.x-c.x; 
	b=b.y-c.y; 
	return d*d+b*b
    }; 
    b2.Math.MulFV=function(b,c){
	return new b2.Vec2(b*c.x,b*c.y)
    }; 

    b2.Math.AddMM=function(b,c){
	return new b2.Mat22(0,b2.Math.AddVV(b.col1,c.col1),b2.Math.AddVV(b.col2,c.col2))
    }; 
    b2.Math.MulMM=function(b,c){
	return new b2.Mat22(0,b2.Math.MulMV(b,c.col1),b2.Math.MulMV(b,c.col2))
    }; 
    b2.Math.MulTMM=function(b,c){
	var d=new b2.Vec2(b2.Math.Dot(b.col1,c.col1),b2.Math.Dot(b.col2,c.col1)); 
	b=new b2.Vec2(b2.Math.Dot(b.col1,c.col2),b2.Math.Dot(b.col2,c.col2)); 
	return new b2.Mat22(0,d,b)
    }; 
    b2.Math.Abs=function(b){
	return b>0?b:-b
    }; 

    b2.Math.AbsV=function(b){
	return new b2.Vec2(b2.Math.Abs(b.x),b2.Math.Abs(b.y))
    }; 
    b2.Math.AbsM=function(b){
	return new b2.Mat22(0,b2.Math.AbsV(b.col1),b2.Math.AbsV(b.col2))
    }; 
    b2.Math.Min=function(b,c){
	return b<c?b:c
    }; 
    b2.Math.MinV=function(b,c){
	return new b2.Vec2(b2.Math.Min(b.x,c.x),b2.Math.Min(b.y,c.y))
    }; 
    b2.Math.Max=function(b,c){
	return b>c?b:c
    }; 
    b2.Math.MaxV=function(b,c){
	return new b2.Vec2(b2.Math.Max(b.x,c.x),b2.Math.Max(b.y,c.y))
    }; 

    b2.Math.Clamp=function(b,c,d){
	return b2.Math.Max(c,b2.Math.Min(b,d))
    }; 
    b2.Math.ClampV=function(b,c,d){
	return b2.Math.MaxV(c,b2.Math.MinV(b,d))
    }; 
    b2.Math.Swap=function(b,c){
	var d=b[0]; 
	b[0]=c[0]; 
	c[0]=d
    }; 
    b2.Math.Random=function(){
	return Math.random()*2-1
    }; 
    b2.Math.RandomRange=function(b,c){
	var d=Math.random(); 
	return d=(c-b)*d+b
    }; 
    b2.Math.NextPowerOfTwo=function(b){
	b|=b>>1&2147483647; 
	b|=b>>2&1073741823; 
	b|=b>>4&268435455; 
	b|=b>>8&16777215; 
	b|=b>>16&65535; 
	return b+1
    }; 

    b2.Math.IsPowerOfTwo=function(b){
	return b>0&&(b&b-1)==0
    }; 
    b2.CircleDef=function(){
	b2.ShapeDef.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.CircleDef.prototype,b2.ShapeDef.prototype); 
    a=b2.CircleDef.prototype; 
    a._super=function(){
	b2.ShapeDef.prototype.__constructor.apply(this,arguments)
    }; 
    a.__constructor=function(){
	this.type=b2.Shape.e_circleShape; 
	this.radius=1
    }; 
    a.__varz=function(){
	this.localPosition=new b2.Vec2(0,0)
    }; 
    a.localPosition=new b2.Vec2(0,0); 
    a.radius=null; 
    b2.ContactPoint=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    a=b2.ContactPoint.prototype; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	this.position=new b2.Vec2; 
	this.velocity=new b2.Vec2; 
	this.normal=new b2.Vec2; 
	this.id=new b2.ContactID
    }; 
    a.shape1=null; 
    a.shape2=null; 
    a.position=new b2.Vec2; 
    a.velocity=new b2.Vec2; 
    a.normal=new b2.Vec2; 
    a.separation=null; 
    a.friction=null; 
    a.restitution=null; 
    a.id=new b2.ContactID; 
    b2.PolygonContact=function(){
	b2.Contact.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PolygonContact.prototype,b2.Contact.prototype); 
    b2.PolygonContact.prototype._super=function(){
	b2.Contact.prototype.__constructor.apply(this,arguments)
    }; 
    b2.PolygonContact.prototype.__constructor=function(b,c){
	this._super(b,c); 
	this.m_manifold=this.m_manifolds[0]; 
	this.m_manifold.pointCount=0
    }; 

    b2.PolygonContact.prototype.__varz=function(){
	this.m0=new b2.Manifold; 
	this.m_manifolds=[new b2.Manifold]
    }; 
    b2.PolygonContact.s_evalCP=new b2.ContactPoint; 
    b2.PolygonContact.Create=function(b,c){
	return new b2.PolygonContact(b,c)
    }; 
    b2.PolygonContact.Destroy=function(){
	
    }; 
    a=b2.PolygonContact.prototype; 
    a.m0=new b2.Manifold; 
    a.m_manifolds=[new b2.Manifold]; 
    a.m_manifold=null; 

    a.Evaluate=function(b){
	var c,d,e,f=this.m_shape1.m_body,g=this.m_shape2.m_body,h,i=0; 
	this.m0.Set(this.m_manifold); 
	b2.Collision.CollidePolygons(this.m_manifold,this.m_shape1,f.m_xf,this.m_shape2,g.m_xf); 
	var j=[false,false]; 
	h=b2.PolygonContact.s_evalCP; 
	h.shape1=this.m_shape1; 
	h.shape2=this.m_shape2; 
	h.friction=this.m_friction; 
	h.restitution=this.m_restitution; 
	if(this.m_manifold.pointCount>0){
	    for(i=0; 
		i<this.m_manifold.pointCount; 
		++i){
		var k=this.m_manifold.points[i]; 
		k.normalImpulse=0; 
		k.tangentImpulse=0; 

		var l=false,m=k.id._key; 
		for(c=0; 
		    c<this.m0.pointCount; 
		    ++c)if(j[c]!=true){
			e=this.m0.points[c]; 
			if(e.id._key==m){
			    j[c]=true; 
			    k.normalImpulse=e.normalImpulse; 
			    k.tangentImpulse=e.tangentImpulse; 
			    l=true; 
			    if(b!=null){
				h.position=f.GetWorldPoint(k.localPoint1); 
				c=f.GetLinearVelocityFromLocalPoint(k.localPoint1); 
				d=g.GetLinearVelocityFromLocalPoint(k.localPoint2); 
				h.velocity.Set(d.x-c.x,d.y-c.y); 
				h.normal.SetV(this.m_manifold.normal); 
				h.separation=k.separation; 
				h.id.key=m; 
				b.Persist(h)}break}}if(l==false&&b!=null){
				    h.position=
					f.GetWorldPoint(k.localPoint1); 
				    c=f.GetLinearVelocityFromLocalPoint(k.localPoint1); 
				    d=g.GetLinearVelocityFromLocalPoint(k.localPoint2); 
				    h.velocity.Set(d.x-c.x,d.y-c.y); 
				    h.normal.SetV(this.m_manifold.normal); 
				    h.separation=k.separation; 
				    h.id.key=m; 
				    b.Add(h)}}this.m_manifoldCount=1}else this.m_manifoldCount=0; 
	if(b!=null)for(i=0; 
		       i<this.m0.pointCount; 
		       ++i)if(!j[i]){
			   e=this.m0.points[i]; 
			   h.position=f.GetWorldPoint(e.localPoint1); 
			   c=f.GetLinearVelocityFromLocalPoint(e.localPoint1); 
			   d=g.GetLinearVelocityFromLocalPoint(e.localPoint2); 

			   h.velocity.Set(d.x-c.x,d.y-c.y); 
			   h.normal.SetV(this.m0.normal); 
			   h.separation=e.separation; 
			   h.id.key=e.id._key; 
			   b.Remove(h)}
    }; 
    a.GetManifolds=function(){
	return this.m_manifolds
    }; 
    b2.MouseJoint=function(){
	b2.Joint.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.MouseJoint.prototype,b2.Joint.prototype); 
    a=b2.MouseJoint.prototype; 
    a._super=function(){
	b2.Joint.prototype.__constructor.apply(this,arguments)
    }; 

    a.__constructor=function(b){
	this._super(b); 
	this.m_target.SetV(b.target); 
	var c=this.m_target.x-this.m_body2.m_xf.position.x,d=this.m_target.y-this.m_body2.m_xf.position.y,e=this.m_body2.m_xf.R; 
	this.m_localAnchor.x=c*e.col1.x+d*e.col1.y; 
	this.m_localAnchor.y=c*e.col2.x+d*e.col2.y; 
	this.m_maxForce=b.maxForce; 
	this.m_impulse.SetZero(); 
	d=this.m_body2.m_mass; 
	e=2*b2.Settings.pi*b.frequencyHz; 
	c=2*d*b.dampingRatio*e; 
	b=b.timeStep*d*e*e; 
	this.m_gamma=1/(c+b); 
	this.m_beta=b/(c+b)
    }; 

    a.__varz=function(){
	this.K=new b2.Mat22; 
	this.K1=new b2.Mat22; 
	this.K2=new b2.Mat22; 
	this.m_localAnchor=new b2.Vec2; 
	this.m_target=new b2.Vec2; 
	this.m_impulse=new b2.Vec2; 
	this.m_mass=new b2.Mat22; 
	this.m_C=new b2.Vec2
    }; 
    a.K=new b2.Mat22; 
    a.K1=new b2.Mat22; 
    a.K2=new b2.Mat22; 
    a.m_localAnchor=new b2.Vec2; 
    a.m_target=new b2.Vec2; 
    a.m_impulse=new b2.Vec2; 
    a.m_mass=new b2.Mat22; 
    a.m_C=new b2.Vec2; 
    a.m_maxForce=null; 
    a.m_beta=null; 
    a.m_gamma=null; 
    a.GetAnchor1=function(){
	return this.m_target
    }; 
    a.GetAnchor2=function(){
	return this.m_body2.GetWorldPoint(this.m_localAnchor)
    }; 

    a.GetReactionForce=function(){
	return this.m_impulse
    }; 
    a.GetReactionTorque=function(){
	return 0
    }; 
    a.SetTarget=function(b){
	this.m_body2.IsSleeping()&&this.m_body2.WakeUp(); 
	this.m_target=b
    }; 

    a.InitVelocityConstraints=function(b){
	var c=this.m_body2,d; 
	d=c.m_xf.R; 
	var e=this.m_localAnchor.x-c.m_sweep.localCenter.x,f=this.m_localAnchor.y-c.m_sweep.localCenter.y,g=d.col1.x*e+d.col2.x*f; 
	f=d.col1.y*e+d.col2.y*f; 
	e=g; 
	d=c.m_invMass; 
	g=c.m_invI; 
	this.K1.col1.x=d; 
	this.K1.col2.x=0; 
	this.K1.col1.y=0; 
	this.K1.col2.y=d; 
	this.K2.col1.x=g*f*f; 
	this.K2.col2.x=-g*e*f; 
	this.K2.col1.y=-g*e*f; 
	this.K2.col2.y=g*e*e; 
	this.K.SetM(this.K1); 
	this.K.AddM(this.K2); 
	this.K.col1.x+=this.m_gamma; 
	this.K.col2.y+=this.m_gamma; 
	this.K.Invert(this.m_mass); 

	this.m_C.x=c.m_sweep.c.x+e-this.m_target.x; 
	this.m_C.y=c.m_sweep.c.y+f-this.m_target.y; 
	c.m_angularVelocity*=0.98; 
	var h=b.dt*this.m_impulse.x; 
	b=b.dt*this.m_impulse.y; 
	c.m_linearVelocity.x+=d*h; 
	c.m_linearVelocity.y+=d*b; 
	c.m_angularVelocity+=g*(e*b-f*h)
    }; 

    a.SolveVelocityConstraints=function(b){
	var c=this.m_body2,d,e,f; 
	d=c.m_xf.R; 
	var g=this.m_localAnchor.x-c.m_sweep.localCenter.x,h=this.m_localAnchor.y-c.m_sweep.localCenter.y; 
	e=d.col1.x*g+d.col2.x*h; 
	h=d.col1.y*g+d.col2.y*h; 
	g=e; 
	e=c.m_linearVelocity.x+-c.m_angularVelocity*h; 
	var i=c.m_linearVelocity.y+c.m_angularVelocity*g; 
	d=this.m_mass; 
	e=e+this.m_beta*b.inv_dt*this.m_C.x+this.m_gamma*b.dt*this.m_impulse.x; 
	f=i+this.m_beta*b.inv_dt*this.m_C.y+this.m_gamma*b.dt*this.m_impulse.y; 
	i=-b.inv_dt*(d.col1.x*e+d.col2.x*
		     f); 
	d=-b.inv_dt*(d.col1.y*e+d.col2.y*f); 
	e=this.m_impulse.x; 
	f=this.m_impulse.y; 
	this.m_impulse.x+=i; 
	this.m_impulse.y+=d; 
	i=this.m_impulse.Length(); 
	i>this.m_maxForce&&this.m_impulse.Multiply(this.m_maxForce/i); 
	i=this.m_impulse.x-e; 
	d=this.m_impulse.y-f; 
	i=b.dt*i; 
	b=b.dt*d; 
	c.m_linearVelocity.x+=c.m_invMass*i; 
	c.m_linearVelocity.y+=c.m_invMass*b; 
	c.m_angularVelocity+=c.m_invI*(g*b-h*i)
    }; 
    a.SolvePositionConstraints=function(){
	return true
    }; 
    b2.CircleContact=function(){
	b2.Contact.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.CircleContact.prototype,b2.Contact.prototype); 
    b2.CircleContact.prototype._super=function(){
	b2.Contact.prototype.__constructor.apply(this,arguments)
    }; 
    b2.CircleContact.prototype.__constructor=function(b,c){
	this._super(b,c); 
	this.m_manifold=this.m_manifolds[0]; 
	this.m_manifold.pointCount=0; 
	b=this.m_manifold.points[0]; 
	b.normalImpulse=0; 
	b.tangentImpulse=0
    }; 

    b2.CircleContact.prototype.__varz=function(){
	this.m_manifolds=[new b2.Manifold]; 
	this.m0=new b2.Manifold
    }; 
    b2.CircleContact.s_evalCP=new b2.ContactPoint; 
    b2.CircleContact.Create=function(b,c){
	return new b2.CircleContact(b,c)
    }; 
    b2.CircleContact.Destroy=function(){
	
    }; 
    a=b2.CircleContact.prototype; 
    a.m_manifolds=[new b2.Manifold]; 
    a.m0=new b2.Manifold; 
    a.m_manifold=null; 

    a.Evaluate=function(b){
	var c,d,e; 
	c=this.m_shape1.m_body; 
	d=this.m_shape2.m_body; 
	this.m0.Set(this.m_manifold); 
	b2.Collision.CollideCircles(this.m_manifold,this.m_shape1,c.m_xf,this.m_shape2,d.m_xf); 
	var f=b2.CircleContact.s_evalCP; 
	f.shape1=this.m_shape1; 
	f.shape2=this.m_shape2; 
	f.friction=this.m_friction; 
	f.restitution=this.m_restitution; 
	if(this.m_manifold.pointCount>0){
	    this.m_manifoldCount=1; 
	    var g=this.m_manifold.points[0]; 
	    if(this.m0.pointCount==0){
		g.normalImpulse=0; 
		g.tangentImpulse=0; 
		if(b){
		    f.position=
			c.GetWorldPoint(g.localPoint1); 
		    c=c.GetLinearVelocityFromLocalPoint(g.localPoint1); 
		    d=d.GetLinearVelocityFromLocalPoint(g.localPoint2); 
		    f.velocity.Set(d.x-c.x,d.y-c.y); 
		    f.normal.SetV(this.m_manifold.normal); 
		    f.separation=g.separation; 
		    f.id.key=g.id._key; 
		    b.Add(f)}}else{
			e=this.m0.points[0]; 
			g.normalImpulse=e.normalImpulse; 
			g.tangentImpulse=e.tangentImpulse; 
			if(b){
			    f.position=c.GetWorldPoint(g.localPoint1); 
			    c=c.GetLinearVelocityFromLocalPoint(g.localPoint1); 
			    d=d.GetLinearVelocityFromLocalPoint(g.localPoint2); 
			    f.velocity.Set(d.x-
					   c.x,d.y-c.y); 
			    f.normal.SetV(this.m_manifold.normal); 
			    f.separation=g.separation; 
			    f.id.key=g.id._key; 
			    b.Persist(f)}}}else{
				this.m_manifoldCount=0; 
				if(this.m0.pointCount>0&&b){
				    e=this.m0.points[0]; 
				    f.position=c.GetWorldPoint(e.localPoint1); 
				    c=c.GetLinearVelocityFromLocalPoint(e.localPoint1); 
				    d=d.GetLinearVelocityFromLocalPoint(e.localPoint2); 
				    f.velocity.Set(d.x-c.x,d.y-c.y); 
				    f.normal.SetV(this.m0.normal); 
				    f.separation=e.separation; 
				    f.id.key=e.id._key; 
				    b.Remove(f)}}
    }; 
    a.GetManifolds=function(){
	return this.m_manifolds
    }; 
    b2.PulleyJoint=function(){
	b2.Joint.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PulleyJoint.prototype,b2.Joint.prototype); 
    b2.PulleyJoint.prototype._super=function(){
	b2.Joint.prototype.__constructor.apply(this,arguments)
    }; 

    b2.PulleyJoint.prototype.__constructor=function(b){
	this._super(b); 
	this.m_ground=this.m_body1.m_world.m_groundBody; 
	this.m_groundAnchor1.x=b.groundAnchor1.x-this.m_ground.m_xf.position.x; 
	this.m_groundAnchor1.y=b.groundAnchor1.y-this.m_ground.m_xf.position.y; 
	this.m_groundAnchor2.x=b.groundAnchor2.x-this.m_ground.m_xf.position.x; 
	this.m_groundAnchor2.y=b.groundAnchor2.y-this.m_ground.m_xf.position.y; 
	this.m_localAnchor1.SetV(b.localAnchor1); 
	this.m_localAnchor2.SetV(b.localAnchor2); 
	this.m_ratio=b.ratio; 
	this.m_constant=
	    b.length1+this.m_ratio*b.length2; 
	this.m_maxLength1=b2.Math.Min(b.maxLength1,this.m_constant-this.m_ratio*b2.PulleyJoint.minPulleyLength); 
	this.m_maxLength2=b2.Math.Min(b.maxLength2,(this.m_constant-b2.PulleyJoint.minPulleyLength)/this.m_ratio); 
	this.m_limitForce2=this.m_limitForce1=this.m_force=0
    }; 

    b2.PulleyJoint.prototype.__varz=function(){
	this.m_groundAnchor1=new b2.Vec2; 
	this.m_groundAnchor2=new b2.Vec2; 
	this.m_localAnchor1=new b2.Vec2; 
	this.m_localAnchor2=new b2.Vec2; 
	this.m_u1=new b2.Vec2; 
	this.m_u2=new b2.Vec2
    }; 
    b2.PulleyJoint.minPulleyLength=2; 
    a=b2.PulleyJoint.prototype; 
    a.m_ground=null; 
    a.m_groundAnchor1=new b2.Vec2; 
    a.m_groundAnchor2=new b2.Vec2; 
    a.m_localAnchor1=new b2.Vec2; 
    a.m_localAnchor2=new b2.Vec2; 
    a.m_u1=new b2.Vec2; 
    a.m_u2=new b2.Vec2; 
    a.m_constant=null; 
    a.m_ratio=null; 
    a.m_maxLength1=null; 

    a.m_maxLength2=null; 
    a.m_pulleyMass=null; 
    a.m_limitMass1=null; 
    a.m_limitMass2=null; 
    a.m_force=null; 
    a.m_limitForce1=null; 
    a.m_limitForce2=null; 
    a.m_positionImpulse=null; 
    a.m_limitPositionImpulse1=null; 
    a.m_limitPositionImpulse2=null; 
    a.m_state=0; 
    a.m_limitState1=0; 
    a.m_limitState2=0; 
    a.GetAnchor1=function(){
	return this.m_body1.GetWorldPoint(this.m_localAnchor1)
    }; 
    a.GetAnchor2=function(){
	return this.m_body2.GetWorldPoint(this.m_localAnchor2)
    }; 

    a.GetReactionForce=function(){
	var b=this.m_u2.Copy(); 
	b.Multiply(this.m_force); 
	return b
    }; 
    a.GetReactionTorque=function(){
	return 0
    }; 
    a.GetGroundAnchor1=function(){
	var b=this.m_ground.m_xf.position.Copy(); 
	b.Add(this.m_groundAnchor1); 
	return b
    }; 
    a.GetGroundAnchor2=function(){
	var b=this.m_ground.m_xf.position.Copy(); 
	b.Add(this.m_groundAnchor2); 
	return b
    }; 

    a.GetLength1=function(){
	var b=this.m_body1.GetWorldPoint(this.m_localAnchor1),c=b.x-(this.m_ground.m_xf.position.x+this.m_groundAnchor1.x); 
	b=b.y-(this.m_ground.m_xf.position.y+this.m_groundAnchor1.y); 
	return Math.sqrt(c*c+b*b)
    }; 
    a.GetLength2=function(){
	var b=this.m_body2.GetWorldPoint(this.m_localAnchor2),c=b.x-(this.m_ground.m_xf.position.x+this.m_groundAnchor2.x); 
	b=b.y-(this.m_ground.m_xf.position.y+this.m_groundAnchor2.y); 
	return Math.sqrt(c*c+b*b)
    }; 
    a.GetRatio=function(){
	return this.m_ratio
    }; 

    a.InitVelocityConstraints=function(b){
	var c=this.m_body1,d=this.m_body2,e; 
	e=c.m_xf.R; 
	var f=this.m_localAnchor1.x-c.m_sweep.localCenter.x,g=this.m_localAnchor1.y-c.m_sweep.localCenter.y,h=e.col1.x*f+e.col2.x*g; 
	g=e.col1.y*f+e.col2.y*g; 
	f=h; 
	e=d.m_xf.R; 
	var i=this.m_localAnchor2.x-d.m_sweep.localCenter.x,j=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	h=e.col1.x*i+e.col2.x*j; 
	j=e.col1.y*i+e.col2.y*j; 
	i=h; 
	e=d.m_sweep.c.x+i; 
	h=d.m_sweep.c.y+j; 
	var k=this.m_ground.m_xf.position.x+this.m_groundAnchor2.x,l=this.m_ground.m_xf.position.y+
	    this.m_groundAnchor2.y; 
	this.m_u1.Set(c.m_sweep.c.x+f-(this.m_ground.m_xf.position.x+this.m_groundAnchor1.x),c.m_sweep.c.y+g-(this.m_ground.m_xf.position.y+this.m_groundAnchor1.y)); 
	this.m_u2.Set(e-k,h-l); 
	e=this.m_u1.Length(); 
	h=this.m_u2.Length(); 
	e>b2.Settings.linearSlop?this.m_u1.Multiply(1/e):this.m_u1.SetZero(); 
	h>b2.Settings.linearSlop?this.m_u2.Multiply(1/h):this.m_u2.SetZero(); 
	if(this.m_constant-e-this.m_ratio*h>0){
	    this.m_state=b2.Joint.e_inactiveLimit; 
	    this.m_force=0}else{
		this.m_state=b2.Joint.e_atUpperLimit; 

		this.m_positionImpulse=0}if(e<this.m_maxLength1){
		    this.m_limitState1=b2.Joint.e_inactiveLimit; 
		    this.m_limitForce1=0}else{
			this.m_limitState1=b2.Joint.e_atUpperLimit; 
			this.m_limitPositionImpulse1=0}if(h<this.m_maxLength2){
			    this.m_limitState2=b2.Joint.e_inactiveLimit; 
			    this.m_limitForce2=0}else{
				this.m_limitState2=b2.Joint.e_atUpperLimit; 
				this.m_limitPositionImpulse2=0}e=f*this.m_u1.y-g*this.m_u1.x; 
	h=i*this.m_u2.y-j*this.m_u2.x; 
	this.m_limitMass1=c.m_invMass+c.m_invI*e*e; 
	this.m_limitMass2=d.m_invMass+d.m_invI*h*
	    h; 
	this.m_pulleyMass=this.m_limitMass1+this.m_ratio*this.m_ratio*this.m_limitMass2; 
	this.m_limitMass1=1/this.m_limitMass1; 
	this.m_limitMass2=1/this.m_limitMass2; 
	this.m_pulleyMass=1/this.m_pulleyMass; 
	if(b.warmStarting){
	    e=b.dt*(-this.m_force-this.m_limitForce1)*this.m_u1.x; 
	    h=b.dt*(-this.m_force-this.m_limitForce1)*this.m_u1.y; 
	    k=b.dt*(-this.m_ratio*this.m_force-this.m_limitForce2)*this.m_u2.x; 
	    b=b.dt*(-this.m_ratio*this.m_force-this.m_limitForce2)*this.m_u2.y; 
	    c.m_linearVelocity.x+=c.m_invMass*e; 
	    c.m_linearVelocity.y+=
	    c.m_invMass*h; 
	    c.m_angularVelocity+=c.m_invI*(f*h-g*e); 
	    d.m_linearVelocity.x+=d.m_invMass*k; 
	    d.m_linearVelocity.y+=d.m_invMass*b; 
	    d.m_angularVelocity+=d.m_invI*(i*b-j*k)}else this.m_limitForce2=this.m_limitForce1=this.m_force=0
    }; 

    a.SolveVelocityConstraints=function(b){
	var c=this.m_body1,d=this.m_body2,e; 
	e=c.m_xf.R; 
	var f=this.m_localAnchor1.x-c.m_sweep.localCenter.x,g=this.m_localAnchor1.y-c.m_sweep.localCenter.y,h=e.col1.x*f+e.col2.x*g; 
	g=e.col1.y*f+e.col2.y*g; 
	f=h; 
	e=d.m_xf.R; 
	var i=this.m_localAnchor2.x-d.m_sweep.localCenter.x,j=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	h=e.col1.x*i+e.col2.x*j; 
	j=e.col1.y*i+e.col2.y*j; 
	i=h; 
	var k,l; 
	if(this.m_state==b2.Joint.e_atUpperLimit){
	    e=c.m_linearVelocity.x+-c.m_angularVelocity*g; 
	    h=c.m_linearVelocity.y+
		c.m_angularVelocity*f; 
	    k=d.m_linearVelocity.x+-d.m_angularVelocity*j; 
	    l=d.m_linearVelocity.y+d.m_angularVelocity*i; 
	    e=-(this.m_u1.x*e+this.m_u1.y*h)-this.m_ratio*(this.m_u2.x*k+this.m_u2.y*l); 
	    l=-b.inv_dt*this.m_pulleyMass*e; 
	    e=this.m_force; 
	    this.m_force=b2.Math.Max(0,this.m_force+l); 
	    l=this.m_force-e; 
	    e=-b.dt*l*this.m_u1.x; 
	    h=-b.dt*l*this.m_u1.y; 
	    k=-b.dt*this.m_ratio*l*this.m_u2.x; 
	    l=-b.dt*this.m_ratio*l*this.m_u2.y; 
	    c.m_linearVelocity.x+=c.m_invMass*e; 
	    c.m_linearVelocity.y+=c.m_invMass*h; 
	    c.m_angularVelocity+=
	    c.m_invI*(f*h-g*e); 
	    d.m_linearVelocity.x+=d.m_invMass*k; 
	    d.m_linearVelocity.y+=d.m_invMass*l; 
	    d.m_angularVelocity+=d.m_invI*(i*l-j*k)}if(this.m_limitState1==b2.Joint.e_atUpperLimit){
		e=c.m_linearVelocity.x+-c.m_angularVelocity*g; 
		h=c.m_linearVelocity.y+c.m_angularVelocity*f; 
		e=-(this.m_u1.x*e+this.m_u1.y*h); 
		l=-b.inv_dt*this.m_limitMass1*e; 
		e=this.m_limitForce1; 
		this.m_limitForce1=b2.Math.Max(0,this.m_limitForce1+l); 
		l=this.m_limitForce1-e; 
		e=-b.dt*l*this.m_u1.x; 
		h=-b.dt*l*this.m_u1.y; 
		c.m_linearVelocity.x+=c.m_invMass*
		    e; 
		c.m_linearVelocity.y+=c.m_invMass*h; 
		c.m_angularVelocity+=c.m_invI*(f*h-g*e)}if(this.m_limitState2==b2.Joint.e_atUpperLimit){
		    k=d.m_linearVelocity.x+-d.m_angularVelocity*j; 
		    l=d.m_linearVelocity.y+d.m_angularVelocity*i; 
		    e=-(this.m_u2.x*k+this.m_u2.y*l); 
		    l=-b.inv_dt*this.m_limitMass2*e; 
		    e=this.m_limitForce2; 
		    this.m_limitForce2=b2.Math.Max(0,this.m_limitForce2+l); 
		    l=this.m_limitForce2-e; 
		    k=-b.dt*l*this.m_u2.x; 
		    l=-b.dt*l*this.m_u2.y; 
		    d.m_linearVelocity.x+=d.m_invMass*k; 
		    d.m_linearVelocity.y+=d.m_invMass*l; 
		    d.m_angularVelocity+=
		    d.m_invI*(i*l-j*k)}
    }; 

    a.SolvePositionConstraints=function(){
	var b=this.m_body1,c=this.m_body2,d,e=this.m_ground.m_xf.position.x+this.m_groundAnchor1.x,f=this.m_ground.m_xf.position.y+this.m_groundAnchor1.y,g=this.m_ground.m_xf.position.x+this.m_groundAnchor2.x,h=this.m_ground.m_xf.position.y+this.m_groundAnchor2.y,i,j,k,l,m,n,o,q=0; 
	if(this.m_state==b2.Joint.e_atUpperLimit){
	    d=b.m_xf.R; 
	    i=this.m_localAnchor1.x-b.m_sweep.localCenter.x; 
	    j=this.m_localAnchor1.y-b.m_sweep.localCenter.y; 
	    m=d.col1.x*i+d.col2.x*j; 
	    j=d.col1.y*i+d.col2.y*
		j; 
	    i=m; 
	    d=c.m_xf.R; 
	    k=this.m_localAnchor2.x-c.m_sweep.localCenter.x; 
	    l=this.m_localAnchor2.y-c.m_sweep.localCenter.y; 
	    m=d.col1.x*k+d.col2.x*l; 
	    l=d.col1.y*k+d.col2.y*l; 
	    k=m; 
	    m=b.m_sweep.c.x+i; 
	    n=b.m_sweep.c.y+j; 
	    o=c.m_sweep.c.x+k; 
	    d=c.m_sweep.c.y+l; 
	    this.m_u1.Set(m-e,n-f); 
	    this.m_u2.Set(o-g,d-h); 
	    d=this.m_u1.Length(); 
	    m=this.m_u2.Length(); 
	    d>b2.Settings.linearSlop?this.m_u1.Multiply(1/d):this.m_u1.SetZero(); 
	    m>b2.Settings.linearSlop?this.m_u2.Multiply(1/m):this.m_u2.SetZero(); 
	    d=this.m_constant-d-this.m_ratio*m; 

	    q=b2.Math.Max(q,-d); 
	    d=b2.Math.Clamp(d+b2.Settings.linearSlop,-b2.Settings.maxLinearCorrection,0); 
	    d=-this.m_pulleyMass*d; 
	    m=this.m_positionImpulse; 
	    this.m_positionImpulse=b2.Math.Max(0,this.m_positionImpulse+d); 
	    d=this.m_positionImpulse-m; 
	    m=-d*this.m_u1.x; 
	    n=-d*this.m_u1.y; 
	    o=-this.m_ratio*d*this.m_u2.x; 
	    d=-this.m_ratio*d*this.m_u2.y; 
	    b.m_sweep.c.x+=b.m_invMass*m; 
	    b.m_sweep.c.y+=b.m_invMass*n; 
	    b.m_sweep.a+=b.m_invI*(i*n-j*m); 
	    c.m_sweep.c.x+=c.m_invMass*o; 
	    c.m_sweep.c.y+=c.m_invMass*d; 
	    c.m_sweep.a+=c.m_invI*
		(k*d-l*o); 
	    b.SynchronizeTransform(); 
	    c.SynchronizeTransform()}if(this.m_limitState1==b2.Joint.e_atUpperLimit){
		d=b.m_xf.R; 
		i=this.m_localAnchor1.x-b.m_sweep.localCenter.x; 
		j=this.m_localAnchor1.y-b.m_sweep.localCenter.y; 
		m=d.col1.x*i+d.col2.x*j; 
		j=d.col1.y*i+d.col2.y*j; 
		i=m; 
		m=b.m_sweep.c.x+i; 
		n=b.m_sweep.c.y+j; 
		this.m_u1.Set(m-e,n-f); 
		d=this.m_u1.Length(); 
		if(d>b2.Settings.linearSlop){
		    this.m_u1.x*=1/d; 
		    this.m_u1.y*=1/d}else this.m_u1.SetZero(); 
		d=this.m_maxLength1-d; 
		q=b2.Math.Max(q,-d); 
		d=b2.Math.Clamp(d+b2.Settings.linearSlop,
				-b2.Settings.maxLinearCorrection,0); 
		d=-this.m_limitMass1*d; 
		e=this.m_limitPositionImpulse1; 
		this.m_limitPositionImpulse1=b2.Math.Max(0,this.m_limitPositionImpulse1+d); 
		d=this.m_limitPositionImpulse1-e; 
		m=-d*this.m_u1.x; 
		n=-d*this.m_u1.y; 
		b.m_sweep.c.x+=b.m_invMass*m; 
		b.m_sweep.c.y+=b.m_invMass*n; 
		b.m_sweep.a+=b.m_invI*(i*n-j*m); 
		b.SynchronizeTransform()}if(this.m_limitState2==b2.Joint.e_atUpperLimit){
		    d=c.m_xf.R; 
		    k=this.m_localAnchor2.x-c.m_sweep.localCenter.x; 
		    l=this.m_localAnchor2.y-c.m_sweep.localCenter.y; 

		    m=d.col1.x*k+d.col2.x*l; 
		    l=d.col1.y*k+d.col2.y*l; 
		    k=m; 
		    o=c.m_sweep.c.x+k; 
		    d=c.m_sweep.c.y+l; 
		    this.m_u2.Set(o-g,d-h); 
		    m=this.m_u2.Length(); 
		    if(m>b2.Settings.linearSlop){
			this.m_u2.x*=1/m; 
			this.m_u2.y*=1/m}else this.m_u2.SetZero(); 
		    d=this.m_maxLength2-m; 
		    q=b2.Math.Max(q,-d); 
		    d=b2.Math.Clamp(d+b2.Settings.linearSlop,-b2.Settings.maxLinearCorrection,0); 
		    d=-this.m_limitMass2*d; 
		    e=this.m_limitPositionImpulse2; 
		    this.m_limitPositionImpulse2=b2.Math.Max(0,this.m_limitPositionImpulse2+d); 
		    d=this.m_limitPositionImpulse2-
			e; 
		    o=-d*this.m_u2.x; 
		    d=-d*this.m_u2.y; 
		    c.m_sweep.c.x+=c.m_invMass*o; 
		    c.m_sweep.c.y+=c.m_invMass*d; 
		    c.m_sweep.a+=c.m_invI*(k*d-l*o); 
		    c.SynchronizeTransform()}return q<b2.Settings.linearSlop
    }; 
    b2.RevoluteJoint=function(){
	b2.Joint.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.RevoluteJoint.prototype,b2.Joint.prototype); 
    b2.RevoluteJoint.prototype._super=function(){
	b2.Joint.prototype.__constructor.apply(this,arguments)
    }; 

    b2.RevoluteJoint.prototype.__constructor=function(b){
	this._super(b); 
	this.m_localAnchor1.SetV(b.localAnchor1); 
	this.m_localAnchor2.SetV(b.localAnchor2); 
	this.m_referenceAngle=b.referenceAngle; 
	this.m_pivotForce.Set(0,0); 
	this.m_limitPositionImpulse=this.m_limitForce=this.m_motorForce=0; 
	this.m_lowerAngle=b.lowerAngle; 
	this.m_upperAngle=b.upperAngle; 
	this.m_maxMotorTorque=b.maxMotorTorque; 
	this.m_motorSpeed=b.motorSpeed; 
	this.m_enableLimit=b.enableLimit; 
	this.m_enableMotor=b.enableMotor
    }; 

    b2.RevoluteJoint.prototype.__varz=function(){
	this.K=new b2.Mat22; 
	this.K1=new b2.Mat22; 
	this.K2=new b2.Mat22; 
	this.K3=new b2.Mat22; 
	this.m_localAnchor1=new b2.Vec2; 
	this.m_localAnchor2=new b2.Vec2; 
	this.m_pivotForce=new b2.Vec2; 
	this.m_pivotMass=new b2.Mat22
    }; 
    b2.RevoluteJoint.tImpulse=new b2.Vec2; 
    a=b2.RevoluteJoint.prototype; 
    a.K=new b2.Mat22; 
    a.K1=new b2.Mat22; 
    a.K2=new b2.Mat22; 
    a.K3=new b2.Mat22; 
    a.m_localAnchor1=new b2.Vec2; 
    a.m_localAnchor2=new b2.Vec2; 
    a.m_pivotForce=new b2.Vec2; 
    a.m_motorForce=null; 
    a.m_limitForce=null; 

    a.m_limitPositionImpulse=null; 
    a.m_pivotMass=new b2.Mat22; 
    a.m_motorMass=null; 
    a.m_enableMotor=null; 
    a.m_maxMotorTorque=null; 
    a.m_motorSpeed=null; 
    a.m_enableLimit=null; 
    a.m_referenceAngle=null; 
    a.m_lowerAngle=null; 
    a.m_upperAngle=null; 
    a.m_limitState=0; 
    a.GetAnchor1=function(){
	return this.m_body1.GetWorldPoint(this.m_localAnchor1)
    }; 
    a.GetAnchor2=function(){
	return this.m_body2.GetWorldPoint(this.m_localAnchor2)
    }; 
    a.GetReactionForce=function(){
	return this.m_pivotForce
    }; 
    a.GetReactionTorque=function(){
	return this.m_limitForce
    }; 

    a.GetJointAngle=function(){
	return this.m_body2.m_sweep.a-this.m_body1.m_sweep.a-this.m_referenceAngle
    }; 
    a.GetJointSpeed=function(){
	return this.m_body2.m_angularVelocity-this.m_body1.m_angularVelocity
    }; 
    a.IsLimitEnabled=function(){
	return this.m_enableLimit
    }; 
    a.EnableLimit=function(b){
	this.m_enableLimit=b
    }; 
    a.GetLowerLimit=function(){
	return this.m_lowerAngle
    }; 
    a.GetUpperLimit=function(){
	return this.m_upperAngle
    }; 
    a.SetLimits=function(b,c){
	this.m_lowerAngle=b; 
	this.m_upperAngle=c
    }; 
    a.IsMotorEnabled=function(){
	return this.m_enableMotor
    }; 

    a.EnableMotor=function(b){
	this.m_enableMotor=b
    }; 
    a.SetMotorSpeed=function(b){
	this.m_motorSpeed=b
    }; 
    a.GetMotorSpeed=function(){
	return this.m_motorSpeed
    }; 
    a.SetMaxMotorTorque=function(b){
	this.m_maxMotorTorque=b
    }; 
    a.GetMotorTorque=function(){
	return this.m_motorForce
    }; 

    a.InitVelocityConstraints=function(b){
	var c=this.m_body1,d=this.m_body2,e,f; 
	e=c.m_xf.R; 
	var g=this.m_localAnchor1.x-c.m_sweep.localCenter.x,h=this.m_localAnchor1.y-c.m_sweep.localCenter.y; 
	f=e.col1.x*g+e.col2.x*h; 
	h=e.col1.y*g+e.col2.y*h; 
	g=f; 
	e=d.m_xf.R; 
	var i=this.m_localAnchor2.x-d.m_sweep.localCenter.x,j=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	f=e.col1.x*i+e.col2.x*j; 
	j=e.col1.y*i+e.col2.y*j; 
	i=f; 
	e=c.m_invMass; 
	f=d.m_invMass; 
	var k=c.m_invI,l=d.m_invI; 
	this.K1.col1.x=e+f; 
	this.K1.col2.x=0; 
	this.K1.col1.y=
	    0; 
	this.K1.col2.y=e+f; 
	this.K2.col1.x=k*h*h; 
	this.K2.col2.x=-k*g*h; 
	this.K2.col1.y=-k*g*h; 
	this.K2.col2.y=k*g*g; 
	this.K3.col1.x=l*j*j; 
	this.K3.col2.x=-l*i*j; 
	this.K3.col1.y=-l*i*j; 
	this.K3.col2.y=l*i*i; 
	this.K.SetM(this.K1); 
	this.K.AddM(this.K2); 
	this.K.AddM(this.K3); 
	this.K.Invert(this.m_pivotMass); 
	this.m_motorMass=1/(k+l); 
	if(this.m_enableMotor==false)this.m_motorForce=0; 
	if(this.m_enableLimit){
	    var m=d.m_sweep.a-c.m_sweep.a-this.m_referenceAngle; 
	    if(b2.Math.Abs(this.m_upperAngle-this.m_lowerAngle)<2*b2.Settings.angularSlop)this.m_limitState=
		b2.Joint.e_equalLimits; 
	    else if(m<=this.m_lowerAngle){
		if(this.m_limitState!=b2.Joint.e_atLowerLimit)this.m_limitForce=0; 
		this.m_limitState=b2.Joint.e_atLowerLimit}else if(m>=this.m_upperAngle){
		    if(this.m_limitState!=b2.Joint.e_atUpperLimit)this.m_limitForce=0; 
		    this.m_limitState=b2.Joint.e_atUpperLimit}else{
			this.m_limitState=b2.Joint.e_inactiveLimit; 
			this.m_limitForce=0}}else this.m_limitForce=0; 
	if(b.warmStarting){
	    c.m_linearVelocity.x-=b.dt*e*this.m_pivotForce.x; 
	    c.m_linearVelocity.y-=b.dt*e*this.m_pivotForce.y; 

	    c.m_angularVelocity-=b.dt*k*(g*this.m_pivotForce.y-h*this.m_pivotForce.x+this.m_motorForce+this.m_limitForce); 
	    d.m_linearVelocity.x+=b.dt*f*this.m_pivotForce.x; 
	    d.m_linearVelocity.y+=b.dt*f*this.m_pivotForce.y; 
	    d.m_angularVelocity+=b.dt*l*(i*this.m_pivotForce.y-j*this.m_pivotForce.x+this.m_motorForce+this.m_limitForce)}else{
		this.m_pivotForce.SetZero(); 
		this.m_limitForce=this.m_motorForce=0}this.m_limitPositionImpulse=0
    }; 

    a.SolveVelocityConstraints=function(b){
	var c=this.m_body1,d=this.m_body2,e,f; 
	e=c.m_xf.R; 
	var g=this.m_localAnchor1.x-c.m_sweep.localCenter.x,h=this.m_localAnchor1.y-c.m_sweep.localCenter.y; 
	f=e.col1.x*g+e.col2.x*h; 
	h=e.col1.y*g+e.col2.y*h; 
	g=f; 
	e=d.m_xf.R; 
	var i=this.m_localAnchor2.x-d.m_sweep.localCenter.x,j=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	f=e.col1.x*i+e.col2.x*j; 
	j=e.col1.y*i+e.col2.y*j; 
	i=f; 
	f=d.m_linearVelocity.x+-d.m_angularVelocity*j-c.m_linearVelocity.x- (-c.m_angularVelocity*h); 
	var k=d.m_linearVelocity.y+
	    d.m_angularVelocity*i-c.m_linearVelocity.y-c.m_angularVelocity*g; 
	e=-b.inv_dt*(this.m_pivotMass.col1.x*f+this.m_pivotMass.col2.x*k); 
	f=-b.inv_dt*(this.m_pivotMass.col1.y*f+this.m_pivotMass.col2.y*k); 
	this.m_pivotForce.x+=e; 
	this.m_pivotForce.y+=f; 
	e=b.dt*e; 
	f=b.dt*f; 
	c.m_linearVelocity.x-=c.m_invMass*e; 
	c.m_linearVelocity.y-=c.m_invMass*f; 
	c.m_angularVelocity-=c.m_invI*(g*f-h*e); 
	d.m_linearVelocity.x+=d.m_invMass*e; 
	d.m_linearVelocity.y+=d.m_invMass*f; 
	d.m_angularVelocity+=d.m_invI*(i*f-j*e); 
	if(this.m_enableMotor&&
	   this.m_limitState!=b2.Joint.e_equalLimits){
	    g=-b.inv_dt*this.m_motorMass*(d.m_angularVelocity-c.m_angularVelocity-this.m_motorSpeed); 
	    h=this.m_motorForce; 
	    this.m_motorForce=b2.Math.Clamp(this.m_motorForce+g,-this.m_maxMotorTorque,this.m_maxMotorTorque); 
	    g=this.m_motorForce-h; 
	    c.m_angularVelocity-=c.m_invI*b.dt*g; 
	    d.m_angularVelocity+=d.m_invI*b.dt*g}if(this.m_enableLimit&&this.m_limitState!=b2.Joint.e_inactiveLimit){
		h=-b.inv_dt*this.m_motorMass*(d.m_angularVelocity-c.m_angularVelocity); 
		if(this.m_limitState==
		   b2.Joint.e_equalLimits)this.m_limitForce+=h; 
		else if(this.m_limitState==b2.Joint.e_atLowerLimit){
		    g=this.m_limitForce; 
		    this.m_limitForce=b2.Math.Max(this.m_limitForce+h,0); 
		    h=this.m_limitForce-g}else if(this.m_limitState==b2.Joint.e_atUpperLimit){
			g=this.m_limitForce; 
			this.m_limitForce=b2.Math.Min(this.m_limitForce+h,0); 
			h=this.m_limitForce-g}c.m_angularVelocity-=c.m_invI*b.dt*h; 
		d.m_angularVelocity+=d.m_invI*b.dt*h}
    }; 

    a.SolvePositionConstraints=function(){
	var b,c=this.m_body1,d=this.m_body2,e=0; 
	e=c.m_xf.R; 
	var f=this.m_localAnchor1.x-c.m_sweep.localCenter.x,g=this.m_localAnchor1.y-c.m_sweep.localCenter.y,h=e.col1.x*f+e.col2.x*g; 
	g=e.col1.y*f+e.col2.y*g; 
	f=h; 
	e=d.m_xf.R; 
	b=this.m_localAnchor2.x-d.m_sweep.localCenter.x; 
	var i=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	h=e.col1.x*b+e.col2.x*i; 
	i=e.col1.y*b+e.col2.y*i; 
	b=h; 
	h=d.m_sweep.c.x+b-(c.m_sweep.c.x+f); 
	var j=d.m_sweep.c.y+i-(c.m_sweep.c.y+g); 
	e=Math.sqrt(h*h+j*j); 

	var k=c.m_invMass,l=d.m_invMass,m=c.m_invI,n=d.m_invI; 
	this.K1.col1.x=k+l; 
	this.K1.col2.x=0; 
	this.K1.col1.y=0; 
	this.K1.col2.y=k+l; 
	this.K2.col1.x=m*g*g; 
	this.K2.col2.x=-m*f*g; 
	this.K2.col1.y=-m*f*g; 
	this.K2.col2.y=m*f*f; 
	this.K3.col1.x=n*i*i; 
	this.K3.col2.x=-n*b*i; 
	this.K3.col1.y=-n*b*i; 
	this.K3.col2.y=n*b*b; 
	this.K.SetM(this.K1); 
	this.K.AddM(this.K2); 
	this.K.AddM(this.K3); 
	this.K.Solve(b2.RevoluteJoint.tImpulse,-h,-j); 
	h=b2.RevoluteJoint.tImpulse.x; 
	j=b2.RevoluteJoint.tImpulse.y; 
	c.m_sweep.c.x-=c.m_invMass*h; 
	c.m_sweep.c.y-=
	    c.m_invMass*j; 
	c.m_sweep.a-=c.m_invI*(f*j-g*h); 
	d.m_sweep.c.x+=d.m_invMass*h; 
	d.m_sweep.c.y+=d.m_invMass*j; 
	d.m_sweep.a+=d.m_invI*(b*j-i*h); 
	c.SynchronizeTransform(); 
	d.SynchronizeTransform(); 
	f=0; 
	if(this.m_enableLimit&&this.m_limitState!=b2.Joint.e_inactiveLimit){
	    b=d.m_sweep.a-c.m_sweep.a-this.m_referenceAngle; 
	    g=0; 
	    if(this.m_limitState==b2.Joint.e_equalLimits){
		b=b2.Math.Clamp(b,-b2.Settings.maxAngularCorrection,b2.Settings.maxAngularCorrection); 
		g=-this.m_motorMass*b; 
		f=b2.Math.Abs(b)}else if(this.m_limitState==
					 b2.Joint.e_atLowerLimit){
		    b=b-this.m_lowerAngle; 
		    f=b2.Math.Max(0,-b); 
		    b=b2.Math.Clamp(b+b2.Settings.angularSlop,-b2.Settings.maxAngularCorrection,0); 
		    g=-this.m_motorMass*b; 
		    b=this.m_limitPositionImpulse; 
		    this.m_limitPositionImpulse=b2.Math.Max(this.m_limitPositionImpulse+g,0); 
		    g=this.m_limitPositionImpulse-b}else if(this.m_limitState==b2.Joint.e_atUpperLimit){
			b=b-this.m_upperAngle; 
			f=b2.Math.Max(0,b); 
			b=b2.Math.Clamp(b-b2.Settings.angularSlop,0,b2.Settings.maxAngularCorrection); 
			g=-this.m_motorMass*
			    b; 
			b=this.m_limitPositionImpulse; 
			this.m_limitPositionImpulse=b2.Math.Min(this.m_limitPositionImpulse+g,0); 
			g=this.m_limitPositionImpulse-b}c.m_sweep.a-=c.m_invI*g; 
	    d.m_sweep.a+=d.m_invI*g; 
	    c.SynchronizeTransform(); 
	    d.SynchronizeTransform()}return e<=b2.Settings.linearSlop&&f<=b2.Settings.angularSlop
    }; 
    b2.PrismaticJoint=function(){
	b2.Joint.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PrismaticJoint.prototype,b2.Joint.prototype); 
    a=b2.PrismaticJoint.prototype; 
    a._super=function(){
	b2.Joint.prototype.__constructor.apply(this,arguments)
    }; 

    a.__constructor=function(b){
	this._super(b); 
	this.m_localAnchor1.SetV(b.localAnchor1); 
	this.m_localAnchor2.SetV(b.localAnchor2); 
	this.m_localXAxis1.SetV(b.localAxis1); 
	this.m_localYAxis1.x=-this.m_localXAxis1.y; 
	this.m_localYAxis1.y=this.m_localXAxis1.x; 
	this.m_refAngle=b.referenceAngle; 
	this.m_linearJacobian.SetZero(); 
	this.m_torque=this.m_angularMass=this.m_force=this.m_linearMass=0; 
	this.m_motorJacobian.SetZero(); 
	this.m_limitPositionImpulse=this.m_limitForce=this.m_motorForce=this.m_motorMass=0; 
	this.m_lowerTranslation=
	    b.lowerTranslation; 
	this.m_upperTranslation=b.upperTranslation; 
	this.m_maxMotorForce=b.maxMotorForce; 
	this.m_motorSpeed=b.motorSpeed; 
	this.m_enableLimit=b.enableLimit; 
	this.m_enableMotor=b.enableMotor
    }; 
    a.__varz=function(){
	this.m_localAnchor1=new b2.Vec2; 
	this.m_localAnchor2=new b2.Vec2; 
	this.m_localXAxis1=new b2.Vec2; 
	this.m_localYAxis1=new b2.Vec2; 
	this.m_linearJacobian=new b2.Jacobian; 
	this.m_motorJacobian=new b2.Jacobian
    }; 
    a.m_localAnchor1=new b2.Vec2; 
    a.m_localAnchor2=new b2.Vec2; 
    a.m_localXAxis1=new b2.Vec2; 

    a.m_localYAxis1=new b2.Vec2; 
    a.m_refAngle=null; 
    a.m_linearJacobian=new b2.Jacobian; 
    a.m_linearMass=null; 
    a.m_force=null; 
    a.m_angularMass=null; 
    a.m_torque=null; 
    a.m_motorJacobian=new b2.Jacobian; 
    a.m_motorMass=null; 
    a.m_motorForce=null; 
    a.m_limitForce=null; 
    a.m_limitPositionImpulse=null; 
    a.m_lowerTranslation=null; 
    a.m_upperTranslation=null; 
    a.m_maxMotorForce=null; 
    a.m_motorSpeed=null; 
    a.m_enableLimit=null; 
    a.m_enableMotor=null; 
    a.m_limitState=0; 
    a.GetAnchor1=function(){
	return this.m_body1.GetWorldPoint(this.m_localAnchor1)
    }; 

    a.GetAnchor2=function(){
	return this.m_body2.GetWorldPoint(this.m_localAnchor2)
    }; 

    a.GetReactionForce=function(){
	var b=this.m_body1.m_xf.R; 
	return new b2.Vec2(this.m_limitForce*this.m_limitForce*(b.col1.x*this.m_localXAxis1.x+b.col2.x*this.m_localXAxis1.y)+this.m_force*this.m_force*(b.col1.x*this.m_localYAxis1.x+b.col2.x*this.m_localYAxis1.y),this.m_limitForce*this.m_limitForce*(b.col1.y*this.m_localXAxis1.x+b.col2.y*this.m_localXAxis1.y)+this.m_force*this.m_force*(b.col1.y*this.m_localYAxis1.x+b.col2.y*this.m_localYAxis1.y))
    }; 
    a.GetReactionTorque=function(){
	return this.m_torque
    }; 

    a.GetJointTranslation=function(){
	var b=this.m_body1,c=this.m_body2,d=b.GetWorldPoint(this.m_localAnchor1),e=c.GetWorldPoint(this.m_localAnchor2); 
	c=e.x-d.x; 
	d=e.y-d.y; 
	b=b.GetWorldVector(this.m_localXAxis1); 
	return b.x*c+b.y*d
    }; 

    a.GetJointSpeed=function(){
	var b=this.m_body1,c=this.m_body2,d; 
	d=b.m_xf.R; 
	var e=this.m_localAnchor1.x-b.m_sweep.localCenter.x,f=this.m_localAnchor1.y-b.m_sweep.localCenter.y,g=d.col1.x*e+d.col2.x*f; 
	f=d.col1.y*e+d.col2.y*f; 
	e=g; 
	d=c.m_xf.R; 
	var h=this.m_localAnchor2.x-c.m_sweep.localCenter.x,i=this.m_localAnchor2.y-c.m_sweep.localCenter.y; 
	g=d.col1.x*h+d.col2.x*i; 
	i=d.col1.y*h+d.col2.y*i; 
	h=g; 
	d=c.m_sweep.c.x+h-(b.m_sweep.c.x+e); 
	g=c.m_sweep.c.y+i-(b.m_sweep.c.y+f); 
	var j=b.GetWorldVector(this.m_localXAxis1),
	k=b.m_linearVelocity,l=c.m_linearVelocity; 
	b=b.m_angularVelocity; 
	c=c.m_angularVelocity; 
	return d*-b*j.y+g*b*j.x+(j.x*(l.x+-c*i-k.x- (-b*f))+j.y*(l.y+c*h-k.y-b*e))
    }; 
    a.IsLimitEnabled=function(){
	return this.m_enableLimit
    }; 
    a.EnableLimit=function(b){
	this.m_enableLimit=b
    }; 
    a.GetLowerLimit=function(){
	return this.m_lowerTranslation
    }; 
    a.GetUpperLimit=function(){
	return this.m_upperTranslation
    }; 
    a.SetLimits=function(b,c){
	this.m_lowerTranslation=b; 
	this.m_upperTranslation=c
    }; 
    a.IsMotorEnabled=function(){
	return this.m_enableMotor
    }; 

    a.EnableMotor=function(b){
	this.m_enableMotor=b
    }; 
    a.SetMotorSpeed=function(b){
	this.m_motorSpeed=b
    }; 
    a.GetMotorSpeed=function(){
	return this.m_motorSpeed
    }; 
    a.SetMaxMotorForce=function(b){
	this.m_maxMotorForce=b
    }; 
    a.GetMotorForce=function(){
	return this.m_motorForce
    }; 

    a.InitVelocityConstraints=function(b){
	var c=this.m_body1,d=this.m_body2,e,f; 
	e=c.m_xf.R; 
	var g=this.m_localAnchor1.x-c.m_sweep.localCenter.x,h=this.m_localAnchor1.y-c.m_sweep.localCenter.y; 
	f=e.col1.x*g+e.col2.x*h; 
	h=e.col1.y*g+e.col2.y*h; 
	g=f; 
	e=d.m_xf.R; 
	var i=this.m_localAnchor2.x-d.m_sweep.localCenter.x,j=this.m_localAnchor2.y-d.m_sweep.localCenter.y; 
	f=e.col1.x*i+e.col2.x*j; 
	j=e.col1.y*i+e.col2.y*j; 
	i=f; 
	f=c.m_invMass; 
	var k=d.m_invMass,l=c.m_invI,m=d.m_invI; 
	e=c.m_xf.R; 
	var n=e.col1.x*this.m_localYAxis1.x+
	    e.col2.x*this.m_localYAxis1.y; 
	e=e.col1.y*this.m_localYAxis1.x+e.col2.y*this.m_localYAxis1.y; 
	var o=d.m_sweep.c.x+i-c.m_sweep.c.x,q=d.m_sweep.c.y+j-c.m_sweep.c.y; 
	this.m_linearJacobian.linear1.x=-n; 
	this.m_linearJacobian.linear1.y=-e; 
	this.m_linearJacobian.linear2.x=n; 
	this.m_linearJacobian.linear2.y=e; 
	this.m_linearJacobian.angular1=-(o*e-q*n); 
	this.m_linearJacobian.angular2=i*e-j*n; 
	this.m_linearMass=f+l*this.m_linearJacobian.angular1*this.m_linearJacobian.angular1+k+m*this.m_linearJacobian.angular2*this.m_linearJacobian.angular2; 

	this.m_linearMass=1/this.m_linearMass; 
	this.m_angularMass=l+m; 
	if(this.m_angularMass>Number.MIN_VALUE)this.m_angularMass=1/this.m_angularMass; 
	if(this.m_enableLimit||this.m_enableMotor){
	    e=c.m_xf.R; 
	    n=e.col1.x*this.m_localXAxis1.x+e.col2.x*this.m_localXAxis1.y; 
	    e=e.col1.y*this.m_localXAxis1.x+e.col2.y*this.m_localXAxis1.y; 
	    this.m_motorJacobian.linear1.x=-n; 
	    this.m_motorJacobian.linear1.y=-e; 
	    this.m_motorJacobian.linear2.x=n; 
	    this.m_motorJacobian.linear2.y=e; 
	    this.m_motorJacobian.angular1=-(o*e-q*n); 
	    this.m_motorJacobian.angular2=
		i*e-j*n; 
	    this.m_motorMass=f+l*this.m_motorJacobian.angular1*this.m_motorJacobian.angular1+k+m*this.m_motorJacobian.angular2*this.m_motorJacobian.angular2; 
	    this.m_motorMass=1/this.m_motorMass; 
	    if(this.m_enableLimit){
		g=n*(o-g)+e*(q-h); 
		if(b2.Math.Abs(this.m_upperTranslation-this.m_lowerTranslation)<2*b2.Settings.linearSlop)this.m_limitState=b2.Joint.e_equalLimits; 
		else if(g<=this.m_lowerTranslation){
		    if(this.m_limitState!=b2.Joint.e_atLowerLimit)this.m_limitForce=0; 
		    this.m_limitState=b2.Joint.e_atLowerLimit}else if(g>=
								      this.m_upperTranslation){
			if(this.m_limitState!=b2.Joint.e_atUpperLimit)this.m_limitForce=0; 
			this.m_limitState=b2.Joint.e_atUpperLimit}else{
			    this.m_limitState=b2.Joint.e_inactiveLimit; 
			    this.m_limitForce=0}}}if(this.m_enableMotor==false)this.m_motorForce=0; 
	if(this.m_enableLimit==false)this.m_limitForce=0; 
	if(b.warmStarting){
	    g=b.dt*(this.m_force*this.m_linearJacobian.linear1.y+(this.m_motorForce+this.m_limitForce)*this.m_motorJacobian.linear1.y); 
	    h=b.dt*(this.m_force*this.m_linearJacobian.linear2.x+(this.m_motorForce+
								  this.m_limitForce)*this.m_motorJacobian.linear2.x); 
	    i=b.dt*(this.m_force*this.m_linearJacobian.linear2.y+(this.m_motorForce+this.m_limitForce)*this.m_motorJacobian.linear2.y); 
	    j=b.dt*(this.m_force*this.m_linearJacobian.angular1-this.m_torque+(this.m_motorForce+this.m_limitForce)*this.m_motorJacobian.angular1); 
	    o=b.dt*(this.m_force*this.m_linearJacobian.angular2+this.m_torque+(this.m_motorForce+this.m_limitForce)*this.m_motorJacobian.angular2); 
	    c.m_linearVelocity.x+=f*b.dt*(this.m_force*this.m_linearJacobian.linear1.x+
					  (this.m_motorForce+this.m_limitForce)*this.m_motorJacobian.linear1.x); 
	    c.m_linearVelocity.y+=f*g; 
	    c.m_angularVelocity+=l*j; 
	    d.m_linearVelocity.x+=k*h; 
	    d.m_linearVelocity.y+=k*i; 
	    d.m_angularVelocity+=m*o}else this.m_motorForce=this.m_limitForce=this.m_torque=this.m_force=0; 
	this.m_limitPositionImpulse=0
    }; 

    a.SolveVelocityConstraints=function(b){
	var c=this.m_body1,d=this.m_body2,e=c.m_invMass,f=d.m_invMass,g=c.m_invI,h=d.m_invI,i; 
	i=this.m_linearJacobian.Compute(c.m_linearVelocity,c.m_angularVelocity,d.m_linearVelocity,d.m_angularVelocity); 
	i=-b.inv_dt*this.m_linearMass*i; 
	this.m_force+=i; 
	i=b.dt*i; 
	c.m_linearVelocity.x+=e*i*this.m_linearJacobian.linear1.x; 
	c.m_linearVelocity.y+=e*i*this.m_linearJacobian.linear1.y; 
	c.m_angularVelocity+=g*i*this.m_linearJacobian.angular1; 
	d.m_linearVelocity.x+=f*i*this.m_linearJacobian.linear2.x; 

	d.m_linearVelocity.y+=f*i*this.m_linearJacobian.linear2.y; 
	d.m_angularVelocity+=h*i*this.m_linearJacobian.angular2; 
	i=-b.inv_dt*this.m_angularMass*(d.m_angularVelocity-c.m_angularVelocity); 
	this.m_torque+=i; 
	i=b.dt*i; 
	c.m_angularVelocity-=g*i; 
	d.m_angularVelocity+=h*i; 
	if(this.m_enableMotor&&this.m_limitState!=b2.Joint.e_equalLimits){
	    i=this.m_motorJacobian.Compute(c.m_linearVelocity,c.m_angularVelocity,d.m_linearVelocity,d.m_angularVelocity)-this.m_motorSpeed; 
	    i=-b.inv_dt*this.m_motorMass*i; 
	    var j=this.m_motorForce; 

	    this.m_motorForce=b2.Math.Clamp(this.m_motorForce+i,-this.m_maxMotorForce,this.m_maxMotorForce); 
	    i=this.m_motorForce-j; 
	    i=b.dt*i; 
	    c.m_linearVelocity.x+=e*i*this.m_motorJacobian.linear1.x; 
	    c.m_linearVelocity.y+=e*i*this.m_motorJacobian.linear1.y; 
	    c.m_angularVelocity+=g*i*this.m_motorJacobian.angular1; 
	    d.m_linearVelocity.x+=f*i*this.m_motorJacobian.linear2.x; 
	    d.m_linearVelocity.y+=f*i*this.m_motorJacobian.linear2.y; 
	    d.m_angularVelocity+=h*i*this.m_motorJacobian.angular2}if(this.m_enableLimit&&this.m_limitState!=
								      b2.Joint.e_inactiveLimit){
		i=this.m_motorJacobian.Compute(c.m_linearVelocity,c.m_angularVelocity,d.m_linearVelocity,d.m_angularVelocity); 
		j=-b.inv_dt*this.m_motorMass*i; 
		if(this.m_limitState==b2.Joint.e_equalLimits)this.m_limitForce+=j; 
		else if(this.m_limitState==b2.Joint.e_atLowerLimit){
		    i=this.m_limitForce; 
		    this.m_limitForce=b2.Math.Max(this.m_limitForce+j,0); 
		    j=this.m_limitForce-i}else if(this.m_limitState==b2.Joint.e_atUpperLimit){
			i=this.m_limitForce; 
			this.m_limitForce=b2.Math.Min(this.m_limitForce+j,0); 

			j=this.m_limitForce-i}i=b.dt*j; 
		c.m_linearVelocity.x+=e*i*this.m_motorJacobian.linear1.x; 
		c.m_linearVelocity.y+=e*i*this.m_motorJacobian.linear1.y; 
		c.m_angularVelocity+=g*i*this.m_motorJacobian.angular1; 
		d.m_linearVelocity.x+=f*i*this.m_motorJacobian.linear2.x; 
		d.m_linearVelocity.y+=f*i*this.m_motorJacobian.linear2.y; 
		d.m_angularVelocity+=h*i*this.m_motorJacobian.angular2}
    }; 

    a.SolvePositionConstraints=function(){
	var b,c,d=this.m_body1,e=this.m_body2,f=d.m_invMass,g=e.m_invMass,h=d.m_invI,i=e.m_invI,j,k; 
	j=d.m_xf.R; 
	var l=this.m_localAnchor1.x-d.m_sweep.localCenter.x,m=this.m_localAnchor1.y-d.m_sweep.localCenter.y; 
	k=j.col1.x*l+j.col2.x*m; 
	m=j.col1.y*l+j.col2.y*m; 
	l=k; 
	j=e.m_xf.R; 
	var n=this.m_localAnchor2.x-e.m_sweep.localCenter.x; 
	b=this.m_localAnchor2.y-e.m_sweep.localCenter.y; 
	k=j.col1.x*n+j.col2.x*b; 
	b=j.col1.y*n+j.col2.y*b; 
	n=k; 
	j=d.m_sweep.c.x+l; 
	m=d.m_sweep.c.y+m; 
	n=e.m_sweep.c.x+
	    n; 
	b=e.m_sweep.c.y+b; 
	n=n-j; 
	b=b-m; 
	j=d.m_xf.R; 
	var o=(j.col1.x*this.m_localYAxis1.x+j.col2.x*this.m_localYAxis1.y)*n+(j.col1.y*this.m_localYAxis1.x+j.col2.y*this.m_localYAxis1.y)*b; 
	o=b2.Math.Clamp(o,-b2.Settings.maxLinearCorrection,b2.Settings.maxLinearCorrection); 
	c=-this.m_linearMass*o; 
	d.m_sweep.c.x+=f*c*this.m_linearJacobian.linear1.x; 
	d.m_sweep.c.y+=f*c*this.m_linearJacobian.linear1.y; 
	d.m_sweep.a+=h*c*this.m_linearJacobian.angular1; 
	e.m_sweep.c.x+=g*c*this.m_linearJacobian.linear2.x; 
	e.m_sweep.c.y+=
	g*c*this.m_linearJacobian.linear2.y; 
	e.m_sweep.a+=i*c*this.m_linearJacobian.angular2; 
	o=b2.Math.Abs(o); 
	c=e.m_sweep.a-d.m_sweep.a-this.m_refAngle; 
	c=b2.Math.Clamp(c,-b2.Settings.maxAngularCorrection,b2.Settings.maxAngularCorrection); 
	var q=-this.m_angularMass*c; 
	d.m_sweep.a-=d.m_invI*q; 
	e.m_sweep.a+=e.m_invI*q; 
	d.SynchronizeTransform(); 
	e.SynchronizeTransform(); 
	q=b2.Math.Abs(c); 
	if(this.m_enableLimit&&this.m_limitState!=b2.Joint.e_inactiveLimit){
	    j=d.m_xf.R; 
	    l=this.m_localAnchor1.x-d.m_sweep.localCenter.x; 

	    m=this.m_localAnchor1.y-d.m_sweep.localCenter.y; 
	    k=j.col1.x*l+j.col2.x*m; 
	    m=j.col1.y*l+j.col2.y*m; 
	    l=k; 
	    j=e.m_xf.R; 
	    n=this.m_localAnchor2.x-e.m_sweep.localCenter.x; 
	    b=this.m_localAnchor2.y-e.m_sweep.localCenter.y; 
	    k=j.col1.x*n+j.col2.x*b; 
	    b=j.col1.y*n+j.col2.y*b; 
	    n=k; 
	    j=d.m_sweep.c.x+l; 
	    m=d.m_sweep.c.y+m; 
	    n=e.m_sweep.c.x+n; 
	    b=e.m_sweep.c.y+b; 
	    n=n-j; 
	    b=b-m; 
	    j=d.m_xf.R; 
	    j=(j.col1.x*this.m_localXAxis1.x+j.col2.x*this.m_localXAxis1.y)*n+(j.col1.y*this.m_localXAxis1.x+j.col2.y*this.m_localXAxis1.y)*b; 
	    b=0; 
	    if(this.m_limitState==
	       b2.Joint.e_equalLimits){
		b=b2.Math.Clamp(j,-b2.Settings.maxLinearCorrection,b2.Settings.maxLinearCorrection); 
		b=-this.m_motorMass*b; 
		o=b2.Math.Max(o,b2.Math.Abs(c))}else if(this.m_limitState==b2.Joint.e_atLowerLimit){
		    b=j-this.m_lowerTranslation; 
		    o=b2.Math.Max(o,-b); 
		    b=b2.Math.Clamp(b+b2.Settings.linearSlop,-b2.Settings.maxLinearCorrection,0); 
		    b=-this.m_motorMass*b; 
		    c=this.m_limitPositionImpulse; 
		    this.m_limitPositionImpulse=b2.Math.Max(this.m_limitPositionImpulse+b,0); 
		    b=this.m_limitPositionImpulse-
			c}else if(this.m_limitState==b2.Joint.e_atUpperLimit){
			    b=j-this.m_upperTranslation; 
			    o=b2.Math.Max(o,b); 
			    b=b2.Math.Clamp(b-b2.Settings.linearSlop,0,b2.Settings.maxLinearCorrection); 
			    b=-this.m_motorMass*b; 
			    c=this.m_limitPositionImpulse; 
			    this.m_limitPositionImpulse=b2.Math.Min(this.m_limitPositionImpulse+b,0); 
			    b=this.m_limitPositionImpulse-c}d.m_sweep.c.x+=f*b*this.m_motorJacobian.linear1.x; 
	    d.m_sweep.c.y+=f*b*this.m_motorJacobian.linear1.y; 
	    d.m_sweep.a+=h*b*this.m_motorJacobian.angular1; 
	    e.m_sweep.c.x+=
	    g*b*this.m_motorJacobian.linear2.x; 
	    e.m_sweep.c.y+=g*b*this.m_motorJacobian.linear2.y; 
	    e.m_sweep.a+=i*b*this.m_motorJacobian.angular2; 
	    d.SynchronizeTransform(); 
	    e.SynchronizeTransform()}return o<=b2.Settings.linearSlop&&q<=b2.Settings.angularSlop
    }; 
    var ClipVertex=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    ClipVertex.prototype.__constructor=function(){
	
    }; 
    ClipVertex.prototype.__varz=function(){
	this.v=new b2.Vec2; 
	this.id=new b2.ContactID
    }; 
    ClipVertex.prototype.v=new b2.Vec2; 
    ClipVertex.prototype.id=new b2.ContactID; 
    b2.NullContact=function(){
	b2.Contact.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.NullContact.prototype,b2.Contact.prototype); 
    a=b2.NullContact.prototype; 
    a._super=function(){
	b2.Contact.prototype.__constructor.apply(this,arguments)
    }; 
    a.__constructor=function(){
	
    }; 
    a.__varz=function(){
	
    }; 
    a.Evaluate=function(){
	
    }; 
    a.GetManifolds=function(){
	return null
    }; 
    b2.PolyAndCircleContact=function(){
	b2.Contact.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.PolyAndCircleContact.prototype,b2.Contact.prototype); 
    b2.PolyAndCircleContact.prototype._super=function(){
	b2.Contact.prototype.__constructor.apply(this,arguments)
    }; 

    b2.PolyAndCircleContact.prototype.__constructor=function(b,c){
	this._super(b,c); 
	this.m_manifold=this.m_manifolds[0]; 
	b2.Settings.Assert(this.m_shape1.m_type==b2.Shape.e_polygonShape); 
	b2.Settings.Assert(this.m_shape2.m_type==b2.Shape.e_circleShape); 
	this.m_manifold.pointCount=0; 
	b=this.m_manifold.points[0]; 
	b.normalImpulse=0; 
	b.tangentImpulse=0
    }; 
    b2.PolyAndCircleContact.prototype.__varz=function(){
	this.m_manifolds=[new b2.Manifold]; 
	this.m0=new b2.Manifold
    }; 
    b2.PolyAndCircleContact.s_evalCP=new b2.ContactPoint; 

    b2.PolyAndCircleContact.Create=function(b,c){
	return new b2.PolyAndCircleContact(b,c)
    }; 
    b2.PolyAndCircleContact.Destroy=function(){
	
    }; 
    a=b2.PolyAndCircleContact.prototype; 
    a.m_manifolds=[new b2.Manifold]; 
    a.m0=new b2.Manifold; 
    a.m_manifold=null; 

    a.Evaluate=function(b){
	var c=0,d,e,f,g=this.m_shape1.m_body,h=this.m_shape2.m_body; 
	this.m0.Set(this.m_manifold); 
	b2.Collision.CollidePolygonAndCircle(this.m_manifold,this.m_shape1,g.m_xf,this.m_shape2,h.m_xf); 
	var i=[false,false],j=b2.PolyAndCircleContact.s_evalCP; 
	j.shape1=this.m_shape1; 
	j.shape2=this.m_shape2; 
	j.friction=this.m_friction; 
	j.restitution=this.m_restitution; 
	if(this.m_manifold.pointCount>0){
	    for(c=0; 
		c<this.m_manifold.pointCount; 
		++c){
		var k=this.m_manifold.points[c]; 
		k.normalImpulse=0; 
		k.tangentImpulse=
		    0; 
		var l=false,m=k.id._key; 
		for(d=0; 
		    d<this.m0.pointCount; 
		    ++d)if(i[d]!=true){
			f=this.m0.points[d]; 
			if(f.id._key==m){
			    i[d]=true; 
			    k.normalImpulse=f.normalImpulse; 
			    k.tangentImpulse=f.tangentImpulse; 
			    l=true; 
			    if(b!=null){
				j.position=g.GetWorldPoint(k.localPoint1); 
				d=g.GetLinearVelocityFromLocalPoint(k.localPoint1); 
				e=h.GetLinearVelocityFromLocalPoint(k.localPoint2); 
				j.velocity.Set(e.x-d.x,e.y-d.y); 
				j.normal.SetV(this.m_manifold.normal); 
				j.separation=k.separation; 
				j.id.key=m; 
				b.Persist(j)}break}}if(l==false&&b!=null){
				    j.position=
					g.GetWorldPoint(k.localPoint1); 
				    d=g.GetLinearVelocityFromLocalPoint(k.localPoint1); 
				    e=h.GetLinearVelocityFromLocalPoint(k.localPoint2); 
				    j.velocity.Set(e.x-d.x,e.y-d.y); 
				    j.normal.SetV(this.m_manifold.normal); 
				    j.separation=k.separation; 
				    j.id.key=m; 
				    b.Add(j)}}this.m_manifoldCount=1}else this.m_manifoldCount=0; 
	if(b!=null)for(c=0; 
		       c<this.m0.pointCount; 
		       ++c)if(!i[c]){
			   f=this.m0.points[c]; 
			   j.position=g.GetWorldPoint(f.localPoint1); 
			   d=g.GetLinearVelocityFromLocalPoint(f.localPoint1); 
			   e=h.GetLinearVelocityFromLocalPoint(f.localPoint2); 

			   j.velocity.Set(e.x-d.x,e.y-d.y); 
			   j.normal.SetV(this.m0.normal); 
			   j.separation=f.separation; 
			   j.id.key=f.id._key; 
			   b.Remove(j)}
    }; 
    a.GetManifolds=function(){
	return this.m_manifolds
    }; 
    b2.ContactManager=function(){
	b2.PairCallback.prototype.__varz.call(this); 
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 
    extend(b2.ContactManager.prototype,b2.PairCallback.prototype); 
    b2.ContactManager.prototype._super=function(){
	b2.PairCallback.prototype.__constructor.apply(this,arguments)
    }; 
    b2.ContactManager.prototype.__constructor=function(){
	this.m_world=null; 
	this.m_destroyImmediate=false
    }; 
    b2.ContactManager.prototype.__varz=function(){
	this.m_nullContact=new b2.NullContact
    }; 

    b2.ContactManager.s_evalCP=new b2.ContactPoint; 
    a=b2.ContactManager.prototype; 
    a.m_world=null; 
    a.m_nullContact=new b2.NullContact; 
    a.m_destroyImmediate=null; 

    a.PairAdded=function(b,c){
	b=b; 
	c=c; 
	var d=b.m_body,e=c.m_body; 
	if(d.IsStatic()&&e.IsStatic())return this.m_nullContact; 
	if(b.m_body==c.m_body)return this.m_nullContact; 
	if(e.IsConnected(d))return this.m_nullContact; 
	if(this.m_world.m_contactFilter!=null&&this.m_world.m_contactFilter.ShouldCollide(b,c)==false)return this.m_nullContact; 
	var f=b2.Contact.Create(b,c,this.m_world.m_blockAllocator); 
	if(f==null)return this.m_nullContact; 
	b=f.m_shape1; 
	c=f.m_shape2; 
	d=b.m_body; 
	e=c.m_body; 
	f.m_prev=null; 
	f.m_next=this.m_world.m_contactList; 

	if(this.m_world.m_contactList!=null)this.m_world.m_contactList.m_prev=f; 
	this.m_world.m_contactList=f; 
	f.m_node1.contact=f; 
	f.m_node1.other=e; 
	f.m_node1.prev=null; 
	f.m_node1.next=d.m_contactList; 
	if(d.m_contactList!=null)d.m_contactList.prev=f.m_node1; 
	d.m_contactList=f.m_node1; 
	f.m_node2.contact=f; 
	f.m_node2.other=d; 
	f.m_node2.prev=null; 
	f.m_node2.next=e.m_contactList; 
	if(e.m_contactList!=null)e.m_contactList.prev=f.m_node2; 
	e.m_contactList=f.m_node2; 
	++this.m_world.m_contactCount; 
	return f
    }; 

    a.PairRemoved=function(b,c,d){
	d!=null&&d!=this.m_nullContact&&this.Destroy(d)
    }; 

    a.Destroy=function(b){
	var c=b.m_shape1,d=b.m_shape2,e=b.m_manifoldCount; 
	if(e>0&&this.m_world.m_contactListener){
	    var f=c.m_body,g=d.m_body,h=b.GetManifolds(),i=b2.ContactManager.s_evalCP; 
	    i.shape1=b.m_shape1; 
	    i.shape2=b.m_shape1; 
	    i.friction=b.m_friction; 
	    i.restitution=b.m_restitution; 
	    for(var j=0; 
		j<e; 
		++j){
		var k=h[j]; 
		i.normal.SetV(k.normal); 
		for(var l=0; 
		    l<k.pointCount; 
		    ++l){
		    var m=k.points[l]; 
		    i.position=f.GetWorldPoint(m.localPoint1); 
		    var n=f.GetLinearVelocityFromLocalPoint(m.localPoint1),o=g.GetLinearVelocityFromLocalPoint(m.localPoint2); 

		    i.velocity.Set(o.x-n.x,o.y-n.y); 
		    i.separation=m.separation; 
		    i.id.key=m.id._key; 
		    this.m_world.m_contactListener.Remove(i)}}}if(b.m_prev)b.m_prev.m_next=b.m_next; 
	if(b.m_next)b.m_next.m_prev=b.m_prev; 
	if(b==this.m_world.m_contactList)this.m_world.m_contactList=b.m_next; 
	c=c.m_body; 
	d=d.m_body; 
	if(b.m_node1.prev)b.m_node1.prev.next=b.m_node1.next; 
	if(b.m_node1.next)b.m_node1.next.prev=b.m_node1.prev; 
	if(b.m_node1==c.m_contactList)c.m_contactList=b.m_node1.next; 
	if(b.m_node2.prev)b.m_node2.prev.next=b.m_node2.next; 

	if(b.m_node2.next)b.m_node2.next.prev=b.m_node2.prev; 
	if(b.m_node2==d.m_contactList)d.m_contactList=b.m_node2.next; 
	b2.Contact.Destroy(b,this.m_world.m_blockAllocator); 
	--this.m_world.m_contactCount
    }; 
    a.Collide=function(){
	for(var b=this.m_world.m_contactList; 
	    b; 
	    b=b.m_next){
	    var c=b.m_shape2.m_body; 
	    b.m_shape1.m_body.IsSleeping()&&c.IsSleeping()||b.Update(this.m_world.m_contactListener)}
    }; 
    b2.World=function(){
	this.__varz(); 
	this.__constructor.apply(this,arguments)
    }; 

    b2.World.prototype.__constructor=function(b,c,d){
	this.m_boundaryListener=this.m_destructionListener=null; 
	this.m_contactFilter=b2.ContactFilter.defaultFilter; 
	this.m_jointList=this.m_contactList=this.m_bodyList=this.m_debugDraw=this.m_contactListener=null; 
	this.m_jointCount=this.m_contactCount=this.m_bodyCount=0; 
	b2.World.m_positionCorrection=true; 
	b2.World.m_warmStarting=true; 
	b2.World.m_continuousPhysics=true; 
	this.m_allowSleep=d; 
	this.m_gravity=c; 
	this.m_lock=false; 
	this.m_inv_dt0=0; 
	this.m_contactManager.m_world=
	    this; 
	this.m_broadPhase=new b2.BroadPhase(b,this.m_contactManager); 
	this.m_groundBody=this.CreateBody(new b2.BodyDef)
    }; 
    b2.World.prototype.__varz=function(){
	this.m_raycastNormal=new b2.Vec2; 
	this.m_contactManager=new b2.ContactManager
    }; 
    b2.World.m_positionCorrection=null; 
    b2.World.m_warmStarting=null; 
    b2.World.m_continuousPhysics=null; 
    b2.World.s_jointColor=new b2.Color(0.5,0.8,0.8); 
    b2.World.s_coreColor=new b2.Color(0.9,0.6,0.6); 
    b2.World.s_xf=new b2.XForm; 
    a=b2.World.prototype; 
    a.m_raycastUserData=null; 

    a.m_raycastSegment=null; 
    a.m_raycastNormal=new b2.Vec2; 
    a.m_blockAllocator=null; 
    a.m_stackAllocator=null; 
    a.m_lock=null; 
    a.m_broadPhase=null; 
    a.m_contactManager=new b2.ContactManager; 
    a.m_bodyList=null; 
    a.m_jointList=null; 
    a.m_contactList=null; 
    a.m_bodyCount=0; 
    a.m_contactCount=0; 
    a.m_jointCount=0; 
    a.m_gravity=null; 
    a.m_allowSleep=null; 
    a.m_groundBody=null; 
    a.m_destructionListener=null; 
    a.m_boundaryListener=null; 
    a.m_contactFilter=null; 
    a.m_contactListener=null; 
    a.m_debugDraw=null; 
    a.m_inv_dt0=null; 

    a.m_positionIterationCount=0; 
    a.SetDestructionListener=function(b){
	this.m_destructionListener=b
    }; 
    a.SetBoundaryListener=function(b){
	this.m_boundaryListener=b
    }; 
    a.SetContactFilter=function(b){
	this.m_contactFilter=b
    }; 
    a.SetContactListener=function(b){
	this.m_contactListener=b
    }; 
    a.SetDebugDraw=function(b){
	this.m_debugDraw=b
    }; 
    a.Validate=function(){
	this.m_broadPhase.Validate()
    }; 
    a.GetProxyCount=function(){
	return this.m_broadPhase.m_proxyCount
    }; 
    a.GetPairCount=function(){
	return this.m_broadPhase.m_pairManager.m_pairCount
    }; 

    a.CreateBody=function(b){
	if(this.m_lock==true)return null; 
	b=new b2.Body(b,this); 
	b.m_prev=null; 
	if(b.m_next=this.m_bodyList)this.m_bodyList.m_prev=b; 
	this.m_bodyList=b; 
	++this.m_bodyCount; 
	return b
    }; 

    a.DestroyBody=function(b){
	if(this.m_lock!=true){
	    for(var c=b.m_jointList; 
		c; 
	       ){
		var d=c; 
		c=c.next; 
		this.m_destructionListener&&this.m_destructionListener.SayGoodbyeJoint(d.joint); 
		this.DestroyJoint(d.joint)}for(c=b.m_shapeList; 
					       c; 
					      ){
		    d=c; 
		    c=c.m_next; 
		    this.m_destructionListener&&this.m_destructionListener.SayGoodbyeShape(d); 
		    d.DestroyProxy(this.m_broadPhase); 
		    b2.Shape.Destroy(d,this.m_blockAllocator)}if(b.m_prev)b.m_prev.m_next=b.m_next; 
	    if(b.m_next)b.m_next.m_prev=b.m_prev; 
	    if(b==this.m_bodyList)this.m_bodyList=b.m_next; 

	    --this.m_bodyCount}
    }; 

    a.CreateJoint=function(b){
	var c=b2.Joint.Create(b,this.m_blockAllocator); 
	c.m_prev=null; 
	if(c.m_next=this.m_jointList)this.m_jointList.m_prev=c; 
	this.m_jointList=c; 
	++this.m_jointCount; 
	c.m_node1.joint=c; 
	c.m_node1.other=c.m_body2; 
	c.m_node1.prev=null; 
	if(c.m_node1.next=c.m_body1.m_jointList)c.m_body1.m_jointList.prev=c.m_node1; 
	c.m_body1.m_jointList=c.m_node1; 
	c.m_node2.joint=c; 
	c.m_node2.other=c.m_body1; 
	c.m_node2.prev=null; 
	if(c.m_node2.next=c.m_body2.m_jointList)c.m_body2.m_jointList.prev=c.m_node2; 
	c.m_body2.m_jointList=
	    c.m_node2; 
	if(b.collideConnected==false){
	    b=b.body1.m_shapeCount<b.body2.m_shapeCount?b.body1:b.body2; 
	    for(var d=b.m_shapeList; 
		d; 
		d=d.m_next)d.RefilterProxy(this.m_broadPhase,b.m_xf)}return c
    }; 

    a.DestroyJoint=function(b){
	var c=b.m_collideConnected; 
	if(b.m_prev)b.m_prev.m_next=b.m_next; 
	if(b.m_next)b.m_next.m_prev=b.m_prev; 
	if(b==this.m_jointList)this.m_jointList=b.m_next; 
	var d=b.m_body1,e=b.m_body2; 
	d.WakeUp(); 
	e.WakeUp(); 
	if(b.m_node1.prev)b.m_node1.prev.next=b.m_node1.next; 
	if(b.m_node1.next)b.m_node1.next.prev=b.m_node1.prev; 
	if(b.m_node1==d.m_jointList)d.m_jointList=b.m_node1.next; 
	b.m_node1.prev=null; 
	b.m_node1.next=null; 
	if(b.m_node2.prev)b.m_node2.prev.next=b.m_node2.next; 
	if(b.m_node2.next)b.m_node2.next.prev=
	    b.m_node2.prev; 
	if(b.m_node2==e.m_jointList)e.m_jointList=b.m_node2.next; 
	b.m_node2.prev=null; 
	b.m_node2.next=null; 
	b2.Joint.Destroy(b,this.m_blockAllocator); 
	--this.m_jointCount; 
	if(c==false){
	    b=d.m_shapeCount<e.m_shapeCount?d:e; 
	    for(c=b.m_shapeList; 
		c; 
		c=c.m_next)c.RefilterProxy(this.m_broadPhase,b.m_xf)}
    }; 
    a.Refilter=function(b){
	b.RefilterProxy(this.m_broadPhase,b.m_body.m_xf)
    }; 
    a.SetWarmStarting=function(b){
	b2.World.m_warmStarting=b
    }; 
    a.SetPositionCorrection=function(b){
	b2.World.m_positionCorrection=b
    }; 

    a.SetContinuousPhysics=function(b){
	b2.World.m_continuousPhysics=b
    }; 
    a.GetBodyCount=function(){
	return this.m_bodyCount
    }; 
    a.GetJointCount=function(){
	return this.m_jointCount
    }; 
    a.GetContactCount=function(){
	return this.m_contactCount
    }; 
    a.SetGravity=function(b){
	this.m_gravity=b
    }; 
    a.GetGroundBody=function(){
	return this.m_groundBody
    }; 

    a.Step=function(b,c){
	this.m_lock=true; 
	var d=new b2.TimeStep; 
	d.dt=b; 
	d.maxIterations=c; 
	d.inv_dt=b>0?1/b:0; 
	d.dtRatio=this.m_inv_dt0*b; 
	d.positionCorrection=b2.World.m_positionCorrection; 
	d.warmStarting=b2.World.m_warmStarting; 
	this.m_contactManager.Collide(); 
	d.dt>0&&this.Solve(d); 
	b2.World.m_continuousPhysics&&d.dt>0&&this.SolveTOI(d); 
	this.DrawDebugData(); 
	this.m_inv_dt0=d.inv_dt; 
	this.m_lock=false
    }; 
    a.Query=function(b,c,d){
	var e=new Array(d); 
	b=this.m_broadPhase.QueryAABB(b,e,d); 
	for(d=0; 
	    d<b; 
	    ++d)c[d]=e[d]; 
	return b
    }; 

    a.Raycast=function(b,c,d,e,f){
	var g=new Array(d); 
	this.m_raycastSegment=b; 
	this.m_raycastUserData=f; 
	f=0; 
	f=e?this.m_broadPhase.QuerySegment(b,g,d,this.RaycastSortKey):this.m_broadPhase.QuerySegment(b,g,d,this.RaycastSortKey2); 
	for(b=0; 
	    b<f; 
	    ++b)c[b]=g[b]; 
	return f
    }; 
    a.RaycastOne=function(b,c,d,e,f){
	var g=new Array(1); 
	e=this.Raycast(b,g,1,e,f); 
	if(e==0)return null; 
	e>1&&trace(e); 
	g=g[0]; 
	e=g.GetBody().GetXForm(); 
	g.TestSegment(e,c,d,b,1); 
	return g
    }; 
    a.GetBodyList=function(){
	return this.m_bodyList
    }; 

    a.GetJointList=function(){
	return this.m_jointList
    }; 

    a.Solve=function(b){
	var c; 
	this.m_positionIterationCount=0; 
	var d=new b2.Island(this.m_bodyCount,this.m_contactCount,this.m_jointCount,this.m_stackAllocator,this.m_contactListener); 
	for(c=this.m_bodyList; 
	    c; 
	    c=c.m_next)c.m_flags&=~b2.Body.e_islandFlag; 
	for(var e=this.m_contactList; 
	    e; 
	    e=e.m_next)e.m_flags&=~b2.Contact.e_islandFlag; 
	for(e=this.m_jointList; 
	    e; 
	    e=e.m_next)e.m_islandFlag=false; 
	e=new Array(this.m_bodyCount); 
	for(var f=this.m_bodyList; 
	    f; 
	    f=f.m_next)if(!(f.m_flags&(b2.Body.e_islandFlag|b2.Body.e_sleepFlag|
				       b2.Body.e_frozenFlag)))if(!f.IsStatic()){
					   d.Clear(); 
					   var g=0; 
					   e[g++]=f; 
					   for(f.m_flags|=b2.Body.e_islandFlag; 
					       g>0; 
					      ){
					       c=e[--g]; 
					       d.AddBody(c); 
					       c.m_flags&=~b2.Body.e_sleepFlag; 
					       if(!c.IsStatic()){
						   for(var h,i=c.m_contactList; 
						       i; 
						       i=i.next)if(!(i.contact.m_flags&(b2.Contact.e_islandFlag|b2.Contact.e_nonSolidFlag)))if(i.contact.m_manifoldCount!=0){
							   d.AddContact(i.contact); 
							   i.contact.m_flags|=b2.Contact.e_islandFlag; 
							   h=i.other; 
							   if(!(h.m_flags&b2.Body.e_islandFlag)){
							       e[g++]=h; 
							       h.m_flags|=b2.Body.e_islandFlag}}for(c=c.m_jointList; 
												    c; 
												    c=
												    c.next)if(c.joint.m_islandFlag!=true){
													d.AddJoint(c.joint); 
													c.joint.m_islandFlag=true; 
													h=c.other; 
													if(!(h.m_flags&b2.Body.e_islandFlag)){
													    e[g++]=h; 
													    h.m_flags|=b2.Body.e_islandFlag}}}}d.Solve(b,this.m_gravity,b2.World.m_positionCorrection,this.m_allowSleep); 
					   if(d.m_positionIterationCount>this.m_positionIterationCount)this.m_positionIterationCount=d.m_positionIterationCount; 
					   for(g=0; 
					       g<d.m_bodyCount; 
					       ++g){
					       c=d.m_bodies[g]; 
					       if(c.IsStatic())c.m_flags&=~b2.Body.e_islandFlag}}for(c=this.m_bodyList; 
												     c; 
												     c=c.m_next)c.m_flags&
	    (b2.Body.e_sleepFlag|b2.Body.e_frozenFlag)||c.IsStatic()||c.SynchronizeShapes()==false&&this.m_boundaryListener!=null&&this.m_boundaryListener.Violation(c); 
	this.m_broadPhase.Commit()
    }; 

    a.SolveTOI=function(b){
	var c,d,e,f=new b2.Island(this.m_bodyCount,b2.Settings.maxTOIContactsPerIsland,0,this.m_stackAllocator,this.m_contactListener),g=new Array(this.m_bodyCount); 
	for(c=this.m_bodyList; 
	    c; 
	    c=c.m_next){
	    c.m_flags&=~b2.Body.e_islandFlag; 
	    c.m_sweep.t0=0}var h; 
	for(h=this.m_contactList; 
	    h; 
	    h=h.m_next)h.m_flags&=~(b2.Contact.e_toiFlag|b2.Contact.e_islandFlag); 
	for(; 
	    ; 
	   ){
	    c=null; 
	    var i=1; 
	    for(h=this.m_contactList; 
		h; 
		h=h.m_next)if(!(h.m_flags&(b2.Contact.e_slowFlag|b2.Contact.e_nonSolidFlag))){
		    d=1; 
		    if(h.m_flags&
		       b2.Contact.e_toiFlag)d=h.m_toi; 
		    else{
			d=h.m_shape1; 
			e=h.m_shape2; 
			d=d.m_body; 
			e=e.m_body; 
			if((d.IsStatic()||d.IsSleeping())&&(e.IsStatic()||e.IsSleeping()))continue; 
			var j=d.m_sweep.t0; 
			if(d.m_sweep.t0<e.m_sweep.t0){
			    j=e.m_sweep.t0; 
			    d.m_sweep.Advance(j)}else if(e.m_sweep.t0<d.m_sweep.t0){
				j=d.m_sweep.t0; 
				e.m_sweep.Advance(j)}d=b2.TimeOfImpact.TimeOfImpact(h.m_shape1,d.m_sweep,h.m_shape2,e.m_sweep); 
			if(d>0&&d<1){
			    d=(1-d)*j+d; 
			    if(d>1)d=1}h.m_toi=d; 
			h.m_flags|=b2.Contact.e_toiFlag}if(Number.MIN_VALUE<d&&d<i){
			    c=h; 
			    i=d}}if(c==
				    null||1-100*Number.MIN_VALUE<i)break; 
	    d=c.m_shape1; 
	    e=c.m_shape2; 
	    d=d.m_body; 
	    e=e.m_body; 
	    d.Advance(i); 
	    e.Advance(i); 
	    c.Update(this.m_contactListener); 
	    c.m_flags&=~b2.Contact.e_toiFlag; 
	    if(c.m_manifoldCount!=0){
		c=d; 
		if(c.IsStatic())c=e; 
		f.Clear(); 
		h=0; 
		g[h++]=c; 
		for(c.m_flags|=b2.Body.e_islandFlag; 
		    h>0; 
		   ){
		    c=g[--h]; 
		    f.AddBody(c); 
		    c.m_flags&=~b2.Body.e_sleepFlag; 
		    if(!c.IsStatic())for(c=c.m_contactList; 
					 c; 
					 c=c.next)if(f.m_contactCount!=f.m_contactCapacity)if(!(c.contact.m_flags&(b2.Contact.e_islandFlag|b2.Contact.e_slowFlag|
														   b2.Contact.e_nonSolidFlag)))if(c.contact.m_manifoldCount!=0){
														       f.AddContact(c.contact); 
														       c.contact.m_flags|=b2.Contact.e_islandFlag; 
														       d=c.other; 
														       if(!(d.m_flags&b2.Body.e_islandFlag)){
															   if(d.IsStatic()==false){
															       d.Advance(i); 
															       d.WakeUp()}g[h++]=d; 
															   d.m_flags|=b2.Body.e_islandFlag}}}h=new b2.TimeStep; 
		h.dt=(1-i)*b.dt; 
		h.inv_dt=1/h.dt; 
		h.maxIterations=b.maxIterations; 
		f.SolveTOI(h); 
		for(i=i=0; 
		    i<f.m_bodyCount; 
		    ++i){
		    c=f.m_bodies[i]; 
		    c.m_flags&=~b2.Body.e_islandFlag; 
		    if(!(c.m_flags&(b2.Body.e_sleepFlag|b2.Body.e_frozenFlag)))if(!c.IsStatic()){
			c.SynchronizeShapes()==
			    false&&this.m_boundaryListener!=null&&this.m_boundaryListener.Violation(c); 
			for(c=c.m_contactList; 
			    c; 
			    c=c.next)c.contact.m_flags&=~b2.Contact.e_toiFlag}}for(i=0; 
										   i<f.m_contactCount; 
										   ++i){
				h=f.m_contacts[i]; 
				h.m_flags&=~(b2.Contact.e_toiFlag|b2.Contact.e_islandFlag)}this.m_broadPhase.Commit()}}
    }; 

    a.DrawJoint=function(b){
	var c=b.m_body1,d=b.m_body2,e=c.m_xf.position,f=d.m_xf.position,g=b.GetAnchor1(),h=b.GetAnchor2(),i=b2.World.s_jointColor; 
	switch(b.m_type){
	case b2.Joint.e_distanceJoint:this.m_debugDraw.DrawSegment(g,h,i); 
	    break; 
	case b2.Joint.e_pulleyJoint:c=b.GetGroundAnchor1(); 
	    b=b.GetGroundAnchor2(); 
	    this.m_debugDraw.DrawSegment(c,g,i); 
	    this.m_debugDraw.DrawSegment(b,h,i); 
	    this.m_debugDraw.DrawSegment(c,b,i); 
	    break; 
	case b2.Joint.e_mouseJoint:this.m_debugDraw.DrawSegment(g,h,i); 
	    break; 
	default:c!=this.m_groundBody&&
		this.m_debugDraw.DrawSegment(e,g,i); 
	    this.m_debugDraw.DrawSegment(g,h,i); 
	    d!=this.m_groundBody&&this.m_debugDraw.DrawSegment(f,h,i)}
    }; 

    a.DrawShape=function(b,c,d,e){
	var f=b2.World.s_coreColor; 
	switch(b.m_type){
	case b2.Shape.e_circleShape:var g=b2.Math.MulX(c,b.m_localPosition); 
	    b=b.m_radius; 
	    this.m_debugDraw.DrawSolidCircle(g,b,c.R.col1,d); 
	    e&&this.m_debugDraw.DrawCircle(g,b-b2.Settings.toiSlop,f); 
	    break; 
	case b2.Shape.e_polygonShape:g=0; 
	    var h=b.GetVertexCount(),i=b.GetVertices(),j=new Array(b2.Settings.maxPolygonVertices); 
	    for(g=0; 
		g<h; 
		++g)j[g]=b2.Math.MulX(c,i[g]); 
	    this.m_debugDraw.DrawSolidPolygon(j,h,d); 
	    if(e){
		d=b.GetCoreVertices(); 

		for(g=0; 
		    g<h; 
		    ++g)j[g]=b2.Math.MulX(c,d[g]); 
		this.m_debugDraw.DrawPolygon(j,h,f)}break}
    }; 

    a.DrawDebugData=function(){
	if(this.m_debugDraw!=null){
	    this.m_debugDraw.m_sprite.graphics.clear(); 
	    var b=this.m_debugDraw.GetFlags(),c=0,d,e,f=new b2.Vec2,g=new b2.Vec2,h=new b2.Vec2,i=new b2.Color(0,0,0),j,k=new b2.AABB,l=new b2.AABB,m=[new b2.Vec2,new b2.Vec2,new b2.Vec2,new b2.Vec2]; 
	    if(b&b2.DebugDraw.e_shapeBit){
		c=(b&b2.DebugDraw.e_coreShapeBit)==b2.DebugDraw.e_coreShapeBit; 
		for(d=this.m_bodyList; 
		    d; 
		    d=d.m_next){
		    j=d.m_xf; 
		    for(e=d.GetShapeList(); 
			e; 
			e=e.m_next)if(d.IsStatic())this.DrawShape(e,j,new b2.Color(0.5,0.9,
										   0.5),c); 
		    else d.IsSleeping()?this.DrawShape(e,j,new b2.Color(0.5,0.5,0.9),c):this.DrawShape(e,j,new b2.Color(0.9,0.9,0.9),c)}}if(b&b2.DebugDraw.e_jointBit)for(c=this.m_jointList; 
																					  c; 
																					  c=c.m_next)this.DrawJoint(c); 
	    if(b&b2.DebugDraw.e_pairBit){
		d=this.m_broadPhase; 
		f.Set(1/d.m_quantizationFactor.x,1/d.m_quantizationFactor.y); 
		i.Set(0.9,0.9,0.3); 
		for(c=0; 
		    c<b2.Pair.tableCapacity; 
		    ++c)for(e=d.m_pairManager.m_hashTable[c]; 
			    e!=b2.Pair.nullPair; 
			   ){
			e=d.m_pairManager.m_pairs[e]; 
			j=d.m_proxyPool[e.proxyId1]; 
			var n=d.m_proxyPool[e.proxyId2]; 

			k.lowerBound.x=d.m_worldAABB.lowerBound.x+f.x*d.m_bounds[0][j.lowerBounds[0]].value; 
			k.lowerBound.y=d.m_worldAABB.lowerBound.y+f.y*d.m_bounds[1][j.lowerBounds[1]].value; 
			k.upperBound.x=d.m_worldAABB.lowerBound.x+f.x*d.m_bounds[0][j.upperBounds[0]].value; 
			k.upperBound.y=d.m_worldAABB.lowerBound.y+f.y*d.m_bounds[1][j.upperBounds[1]].value; 
			l.lowerBound.x=d.m_worldAABB.lowerBound.x+f.x*d.m_bounds[0][n.lowerBounds[0]].value; 
			l.lowerBound.y=d.m_worldAABB.lowerBound.y+f.y*d.m_bounds[1][n.lowerBounds[1]].value; 

			l.upperBound.x=d.m_worldAABB.lowerBound.x+f.x*d.m_bounds[0][n.upperBounds[0]].value; 
			l.upperBound.y=d.m_worldAABB.lowerBound.y+f.y*d.m_bounds[1][n.upperBounds[1]].value; 
			g.x=0.5*(k.lowerBound.x+k.upperBound.x); 
			g.y=0.5*(k.lowerBound.y+k.upperBound.y); 
			h.x=0.5*(l.lowerBound.x+l.upperBound.x); 
			h.y=0.5*(l.lowerBound.y+l.upperBound.y); 
			this.m_debugDraw.DrawSegment(g,h,i); 
			e=e.next}}if(b&b2.DebugDraw.e_aabbBit){
			    d=this.m_broadPhase; 
			    g=d.m_worldAABB.lowerBound; 
			    h=d.m_worldAABB.upperBound; 
			    f.Set(1/d.m_quantizationFactor.x,
				  1/d.m_quantizationFactor.y); 
			    i.Set(0.9,0.3,0.9); 
			    for(c=0; 
				c<b2.Settings.maxProxies; 
				++c){
				l=d.m_proxyPool[c]; 
				if(l.IsValid()!=false){
				    k.lowerBound.x=g.x+f.x*d.m_bounds[0][l.lowerBounds[0]].value; 
				    k.lowerBound.y=g.y+f.y*d.m_bounds[1][l.lowerBounds[1]].value; 
				    k.upperBound.x=g.x+f.x*d.m_bounds[0][l.upperBounds[0]].value; 
				    k.upperBound.y=g.y+f.y*d.m_bounds[1][l.upperBounds[1]].value; 
				    m[0].Set(k.lowerBound.x,k.lowerBound.y); 
				    m[1].Set(k.upperBound.x,k.lowerBound.y); 
				    m[2].Set(k.upperBound.x,k.upperBound.y); 
				    m[3].Set(k.lowerBound.x,
					     k.upperBound.y); 
				    this.m_debugDraw.DrawPolygon(m,4,i)}}m[0].Set(g.x,g.y); 
			    m[1].Set(h.x,g.y); 
			    m[2].Set(h.x,h.y); 
			    m[3].Set(g.x,h.y); 
			    this.m_debugDraw.DrawPolygon(m,4,new b2.Color(0.3,0.9,0.9))}if(b&b2.DebugDraw.e_obbBit){
				i.Set(0.5,0.3,0.5); 
				for(d=this.m_bodyList; 
				    d; 
				    d=d.m_next){
				    j=d.m_xf; 
				    for(e=d.GetShapeList(); 
					e; 
					e=e.m_next)if(e.m_type==b2.Shape.e_polygonShape){
					    f=e.GetOBB(); 
					    c=f.extents; 
					    m[0].Set(-c.x,-c.y); 
					    m[1].Set(c.x,-c.y); 
					    m[2].Set(c.x,c.y); 
					    m[3].Set(-c.x,c.y); 
					    for(c=0; 
						c<4; 
						++c){
						k=f.R; 
						g=m[c]; 
						h=f.center.x+(k.col1.x*
							      g.x+k.col2.x*g.y); 
						m[c].y=f.center.y+(k.col1.y*g.x+k.col2.y*g.y); 
						m[c].x=h; 
						k=j.R; 
						h=j.position.x+(k.col1.x*g.x+k.col2.x*g.y); 
						m[c].y=j.position.y+(k.col1.y*g.x+k.col2.y*g.y); 
						m[c].x=h}this.m_debugDraw.DrawPolygon(m,4,i)}}}if(b&b2.DebugDraw.e_centerOfMassBit)for(d=this.m_bodyList; 
																       d; 
																       d=d.m_next){
						    j=b2.World.s_xf; 
						    j.R=d.m_xf.R; 
						    j.position=d.GetWorldCenter(); 
						    this.m_debugDraw.DrawXForm(j)}}
    }; 

    a.RaycastSortKey=function(b){
	if(this.m_contactFilter&&!this.m_contactFilter.RayCollide(this.m_raycastUserData,b))return-1; 
	var c=b.GetBody().GetXForm(),d=[0]; 
	if(b.TestSegment(c,d,this.m_raycastNormal,this.m_raycastSegment,1)==b2.Shape.e_missCollide)return-1; 
	return d[0]
    }; 

    a.RaycastSortKey2=function(b){
	if(this.m_contactFilter&&!this.m_contactFilter.RayCollide(this.m_raycastUserData,b))return-1; 
	var c=b.GetBody().GetXForm(),d=[0]; 
	if(b.TestSegment(c,d,this.m_raycastNormal,this.m_raycastSegment,1)!=b2.Shape.e_hitCollide)return-1; 
	return d[0]
    }; 



    ig.global.b2 = b2; 

}); 
