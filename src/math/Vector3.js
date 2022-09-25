import * as MathUtils from './MathUtils.js';
import { Quaternion } from './Quaternion.js';

const ArrayBufferType = typeof SharedArrayBuffer === 'function' ? SharedArrayBuffer : ArrayBuffer;

class Vector3 extends Float32Array {

	constructor( x = 0, y = 0, z = 0 ) {

		super( new ArrayBufferType( Float32Array.BYTES_PER_ELEMENT * 3 ) );
		Vector3.prototype.isVector3 = true;

		this[ 0 ] = x;
		this[ 1 ] = y;
		this[ 2 ] = z;

	}

	get x() {

		return this[ 0 ];

	}

	set x( x ) {

		this[ 0 ] = x;

	}

	get y() {

		return this[ 1 ];

	}

	set y( y ) {

		this[ 1 ] = y;

	}

	get z() {

		return this[ 2 ];

	}

	set z( z ) {

		this[ 2 ] = z;

	}

	set( x, y, z ) {

		if ( z === undefined ) z = this[ 2 ]; // sprite.scale.set(x,y)

		this[ 0 ] = x;
		this[ 1 ] = y;
		this[ 2 ] = z;

		return this;

	}

	setScalar( scalar ) {

		this[ 0 ] = scalar;
		this[ 1 ] = scalar;
		this[ 2 ] = scalar;

		return this;

	}

	setX( x ) {

		this[ 0 ] = x;

		return this;

	}

	setY( y ) {

		this[ 1 ] = y;

		return this;

	}

	setZ( z ) {

		this[ 2 ] = z;

		return this;

	}

	setComponent( index, value ) {

		switch ( index ) {

			case 0: this[ 0 ] = value; break;
			case 1: this[ 1 ] = value; break;
			case 2: this[ 2 ] = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

		return this;

	}

	getComponent( index ) {

		switch ( index ) {

			case 0: return this[ 0 ];
			case 1: return this[ 1 ];
			case 2: return this[ 2 ];
			default: throw new Error( 'index is out of range: ' + index );

		}

	}

	clone() {

		return new this.constructor( this[ 0 ], this[ 1 ], this[ 2 ] );

	}

	copy( v ) {

		this[ 0 ] = v[ 0 ];
		this[ 1 ] = v[ 1 ];
		this[ 2 ] = v[ 2 ];

		return this;

	}

	add( v ) {

		this[ 0 ] += v[ 0 ];
		this[ 1 ] += v[ 1 ];
		this[ 2 ] += v[ 2 ];

		return this;

	}

	addScalar( s ) {

		this[ 0 ] += s;
		this[ 1 ] += s;
		this[ 2 ] += s;

		return this;

	}

	addVectors( a, b ) {

		this[ 0 ] = a[ 0 ] + b[ 0 ];
		this[ 1 ] = a[ 1 ] + b[ 1 ];
		this[ 2 ] = a[ 2 ] + b[ 2 ];

		return this;

	}

	addScaledVector( v, s ) {

		this[ 0 ] += v[ 0 ] * s;
		this[ 1 ] += v[ 1 ] * s;
		this[ 2 ] += v[ 2 ] * s;

		return this;

	}

	sub( v ) {

		this[ 0 ] -= v[ 0 ];
		this[ 1 ] -= v[ 1 ];
		this[ 2 ] -= v[ 2 ];

		return this;

	}

	subScalar( s ) {

		this[ 0 ] -= s;
		this[ 1 ] -= s;
		this[ 2 ] -= s;

		return this;

	}

	subVectors( a, b ) {

		this[ 0 ] = a[ 0 ] - b[ 0 ];
		this[ 1 ] = a[ 1 ] - b[ 1 ];
		this[ 2 ] = a[ 2 ] - b[ 2 ];

		return this;

	}

	multiply( v ) {

		this[ 0 ] *= v[ 0 ];
		this[ 1 ] *= v[ 1 ];
		this[ 2 ] *= v[ 2 ];

		return this;

	}

	multiplyScalar( scalar ) {

		this[ 0 ] *= scalar;
		this[ 1 ] *= scalar;
		this[ 2 ] *= scalar;

		return this;

	}

	multiplyVectors( a, b ) {

		this[ 0 ] = a[ 0 ] * b[ 0 ];
		this[ 1 ] = a[ 1 ] * b[ 1 ];
		this[ 2 ] = a[ 2 ] * b[ 2 ];

		return this;

	}

	applyEuler( euler ) {

		return this.applyQuaternion( _quaternion.setFromEuler( euler ) );

	}

	applyAxisAngle( axis, angle ) {

		return this.applyQuaternion( _quaternion.setFromAxisAngle( axis, angle ) );

	}

	applyMatrix3( m ) {

		const x = this[ 0 ], y = this[ 1 ], z = this[ 2 ];
		const e = m.elements;

		this[ 0 ] = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this[ 1 ] = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this[ 2 ] = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	}

	applyNormalMatrix( m ) {

		return this.applyMatrix3( m ).normalize();

	}

	applyMatrix4( m ) {

		const x = this[ 0 ], y = this[ 1 ], z = this[ 2 ];
		const e = m.elements;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this[ 0 ] = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this[ 1 ] = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this[ 2 ] = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;

	}

	applyQuaternion( q ) {

		const x = this[ 0 ], y = this[ 1 ], z = this[ 2 ];
		const qx = q[ 0 ], qy = q[ 1 ], qz = q[ 2 ], qw = q.w;

		// calculate quat * vector

		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this[ 0 ] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this[ 1 ] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this[ 2 ] = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	}

	project( camera ) {

		return this.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );

	}

	unproject( camera ) {

		return this.applyMatrix4( camera.projectionMatrixInverse ).applyMatrix4( camera.matrixWorld );

	}

	transformDirection( m ) {

		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		const x = this[ 0 ], y = this[ 1 ], z = this[ 2 ];
		const e = m.elements;

		this[ 0 ] = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
		this[ 1 ] = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
		this[ 2 ] = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		return this.normalize();

	}

	divide( v ) {

		this[ 0 ] /= v[ 0 ];
		this[ 1 ] /= v[ 1 ];
		this[ 2 ] /= v[ 2 ];

		return this;

	}

	divideScalar( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	}

	min( v ) {

		this[ 0 ] = Math.min( this[ 0 ], v[ 0 ] );
		this[ 1 ] = Math.min( this[ 1 ], v[ 1 ] );
		this[ 2 ] = Math.min( this[ 2 ], v[ 2 ] );

		return this;

	}

	max( v ) {

		this[ 0 ] = Math.max( this[ 0 ], v[ 0 ] );
		this[ 1 ] = Math.max( this[ 1 ], v[ 1 ] );
		this[ 2 ] = Math.max( this[ 2 ], v[ 2 ] );

		return this;

	}

	clamp( min, max ) {

		// assumes min < max, componentwise

		this[ 0 ] = Math.max( min[ 0 ], Math.min( max[ 0 ], this[ 0 ] ) );
		this[ 1 ] = Math.max( min[ 1 ], Math.min( max[ 1 ], this[ 1 ] ) );
		this[ 2 ] = Math.max( min[ 2 ], Math.min( max[ 2 ], this[ 2 ] ) );

		return this;

	}

	clampScalar( minVal, maxVal ) {

		this[ 0 ] = Math.max( minVal, Math.min( maxVal, this[ 0 ] ) );
		this[ 1 ] = Math.max( minVal, Math.min( maxVal, this[ 1 ] ) );
		this[ 2 ] = Math.max( minVal, Math.min( maxVal, this[ 2 ] ) );

		return this;

	}

	clampLength( min, max ) {

		const length = this.length();

		return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

	}

	floor() {

		this[ 0 ] = Math.floor( this[ 0 ] );
		this[ 1 ] = Math.floor( this[ 1 ] );
		this[ 2 ] = Math.floor( this[ 2 ] );

		return this;

	}

	ceil() {

		this[ 0 ] = Math.ceil( this[ 0 ] );
		this[ 1 ] = Math.ceil( this[ 1 ] );
		this[ 2 ] = Math.ceil( this[ 2 ] );

		return this;

	}

	round() {

		this[ 0 ] = Math.round( this[ 0 ] );
		this[ 1 ] = Math.round( this[ 1 ] );
		this[ 2 ] = Math.round( this[ 2 ] );

		return this;

	}

	roundToZero() {

		this[ 0 ] = ( this[ 0 ] < 0 ) ? Math.ceil( this[ 0 ] ) : Math.floor( this[ 0 ] );
		this[ 1 ] = ( this[ 1 ] < 0 ) ? Math.ceil( this[ 1 ] ) : Math.floor( this[ 1 ] );
		this[ 2 ] = ( this[ 2 ] < 0 ) ? Math.ceil( this[ 2 ] ) : Math.floor( this[ 2 ] );

		return this;

	}

	negate() {

		this[ 0 ] = - this[ 0 ];
		this[ 1 ] = - this[ 1 ];
		this[ 2 ] = - this[ 2 ];

		return this;

	}

	dot( v ) {

		return this[ 0 ] * v[ 0 ] + this[ 1 ] * v[ 1 ] + this[ 2 ] * v[ 2 ];

	}

	// TODO lengthSquared?

	lengthSq() {

		return this[ 0 ] * this[ 0 ] + this[ 1 ] * this[ 1 ] + this[ 2 ] * this[ 2 ];

	}

	length() {

		return Math.sqrt( this[ 0 ] * this[ 0 ] + this[ 1 ] * this[ 1 ] + this[ 2 ] * this[ 2 ] );

	}

	manhattanLength() {

		return Math.abs( this[ 0 ] ) + Math.abs( this[ 1 ] ) + Math.abs( this[ 2 ] );

	}

	normalize() {

		return this.divideScalar( this.length() || 1 );

	}

	setLength( length ) {

		return this.normalize().multiplyScalar( length );

	}

	lerp( v, alpha ) {

		this[ 0 ] += ( v[ 0 ] - this[ 0 ] ) * alpha;
		this[ 1 ] += ( v[ 1 ] - this[ 1 ] ) * alpha;
		this[ 2 ] += ( v[ 2 ] - this[ 2 ] ) * alpha;

		return this;

	}

	lerpVectors( v1, v2, alpha ) {

		this[ 0 ] = v1[ 0 ] + ( v2[ 0 ] - v1[ 0 ] ) * alpha;
		this[ 1 ] = v1[ 1 ] + ( v2[ 1 ] - v1[ 1 ] ) * alpha;
		this[ 2 ] = v1[ 2 ] + ( v2[ 2 ] - v1[ 2 ] ) * alpha;

		return this;

	}

	cross( v ) {

		return this.crossVectors( this, v );

	}

	crossVectors( a, b ) {

		const ax = a[ 0 ], ay = a[ 1 ], az = a[ 2 ];
		const bx = b[ 0 ], by = b[ 1 ], bz = b[ 2 ];

		this[ 0 ] = ay * bz - az * by;
		this[ 1 ] = az * bx - ax * bz;
		this[ 2 ] = ax * by - ay * bx;

		return this;

	}

	projectOnVector( v ) {

		const denominator = v.lengthSq();

		if ( denominator === 0 ) return this.set( 0, 0, 0 );

		const scalar = v.dot( this ) / denominator;

		return this.copy( v ).multiplyScalar( scalar );

	}

	projectOnPlane( planeNormal ) {

		_vector.copy( this ).projectOnVector( planeNormal );

		return this.sub( _vector );

	}

	reflect( normal ) {

		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		return this.sub( _vector.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

	}

	angleTo( v ) {

		const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

		if ( denominator === 0 ) return Math.PI / 2;

		const theta = this.dot( v ) / denominator;

		// clamp, to handle numerical problems

		return Math.acos( MathUtils.clamp( theta, - 1, 1 ) );

	}

	distanceTo( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared( v ) {

		const dx = this[ 0 ] - v[ 0 ], dy = this[ 1 ] - v[ 1 ], dz = this[ 2 ] - v[ 2 ];

		return dx * dx + dy * dy + dz * dz;

	}

	manhattanDistanceTo( v ) {

		return Math.abs( this[ 0 ] - v[ 0 ] ) + Math.abs( this[ 1 ] - v[ 1 ] ) + Math.abs( this[ 2 ] - v[ 2 ] );

	}

	setFromSpherical( s ) {

		return this.setFromSphericalCoords( s.radius, s.phi, s.theta );

	}

	setFromSphericalCoords( radius, phi, theta ) {

		const sinPhiRadius = Math.sin( phi ) * radius;

		this[ 0 ] = sinPhiRadius * Math.sin( theta );
		this[ 1 ] = Math.cos( phi ) * radius;
		this[ 2 ] = sinPhiRadius * Math.cos( theta );

		return this;

	}

	setFromCylindrical( c ) {

		return this.setFromCylindricalCoords( c.radius, c.theta, c[ 1 ] );

	}

	setFromCylindricalCoords( radius, theta, y ) {

		this[ 0 ] = radius * Math.sin( theta );
		this[ 1 ] = y;
		this[ 2 ] = radius * Math.cos( theta );

		return this;

	}

	setFromMatrixPosition( m ) {

		const e = m.elements;

		this[ 0 ] = e[ 12 ];
		this[ 1 ] = e[ 13 ];
		this[ 2 ] = e[ 14 ];

		return this;

	}

	setFromMatrixScale( m ) {

		const sx = this.setFromMatrixColumn( m, 0 ).length();
		const sy = this.setFromMatrixColumn( m, 1 ).length();
		const sz = this.setFromMatrixColumn( m, 2 ).length();

		this[ 0 ] = sx;
		this[ 1 ] = sy;
		this[ 2 ] = sz;

		return this;

	}

	setFromMatrixColumn( m, index ) {

		return this.fromArray( m.elements, index * 4 );

	}

	setFromMatrix3Column( m, index ) {

		return this.fromArray( m.elements, index * 3 );

	}

	setFromEuler( e ) {

		this[ 0 ] = e._x;
		this[ 1 ] = e._y;
		this[ 2 ] = e._z;

		return this;

	}

	equals( v ) {

		return ( ( v[ 0 ] === this[ 0 ] ) && ( v[ 1 ] === this[ 1 ] ) && ( v[ 2 ] === this[ 2 ] ) );

	}

	fromArray( array, offset = 0 ) {

		this[ 0 ] = array[ offset ];
		this[ 1 ] = array[ offset + 1 ];
		this[ 2 ] = array[ offset + 2 ];

		return this;

	}

	toArray( array = [], offset = 0 ) {

		array[ offset ] = this[ 0 ];
		array[ offset + 1 ] = this[ 1 ];
		array[ offset + 2 ] = this[ 2 ];

		return array;

	}

	fromBufferAttribute( attribute, index ) {

		this[ 0 ] = attribute.getX( index );
		this[ 1 ] = attribute.getY( index );
		this[ 2 ] = attribute.getZ( index );

		return this;

	}

	random() {

		this[ 0 ] = Math.random();
		this[ 1 ] = Math.random();
		this[ 2 ] = Math.random();

		return this;

	}

	randomDirection() {

		// Derived from https://mathworld.wolfram.com/SpherePointPicking.html

		const u = ( Math.random() - 0.5 ) * 2;
		const t = Math.random() * Math.PI * 2;
		const f = Math.sqrt( 1 - u ** 2 );

		this[ 0 ] = f * Math.cos( t );
		this[ 1 ] = f * Math.sin( t );
		this[ 2 ] = u;

		return this;

	}

	*[ Symbol.iterator ]() {

		yield this[ 0 ];
		yield this[ 1 ];
		yield this[ 2 ];

	}

}

const _vector = /*@__PURE__*/ new Vector3();
const _quaternion = /*@__PURE__*/ new Quaternion();

export { Vector3 };
