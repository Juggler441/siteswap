"use strict";

function is_even(n) {
	return ! (n % 2);
}

function avg(lst) {
	return lst.reduce((a, b) => a + b) / lst.length;
}

function loop_count(n) {
	let i = 0;
	return () => {
		if (i < n) {
			return i++;
		}
		i = 0;
		return i++;
	}
}

function init_list(head, len) {
	if (len <= 0) {
		return null;
	}
	head.next = init_list({}, len - 1);
	return head;
}

function filter_list(head, f) {
	if (head === null) {
		return null;
	}
	if (f(head)) {
		return head;
	}
	return filter_list(head.next, f);
}

function map_list(head, f, index = 0) {
	if (head === null) {
		return null;
	}
	f(head, index);
	return map_list(head.next, f, index + 1);
}

function index_list(head, index) {
	if (index <= 0) {
		return head;
	}
	return index_list(head.next, index - 1);
}

function circle(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI);
	ctx.closePath();
	ctx.stroke();
}

function background(color) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.stroke();
}

function reset_ball(ball) {
	ball.y = canvas.height;
	//ball.hand = !ball.hand;
	if (ball.hand) {
		ball.x = 2 * canvas.width / 3; // right
	} else {
		ball.x = canvas.width / 3; // left
	}
	ball.dx = 0;
	ball.dy = 0;
	ball.ddy = 0;
	ball.flying = false;
}

function init_balls(balls, n_balls) {
	balls = init_list(balls, n_balls);
	let hand = true;
	// true = right, false = left
	// from the viewers perspective
	map_list(balls, (ball) => { // set alternating hands
		ball.hand = hand;
		hand = !hand;
	});
	map_list(balls, reset_ball);
	return balls;
}

function draw() {
	cicles++;
	if (cicles > 60) {
		cicles = 0;
		let own_siteswap = siteswap[loop_count_i()];
		let ball = index_list(balls, loop_count_n());
		if (ball === null) {
			console.log("ERROR");
			return null; // exits the requestAnimationFrame loop
		}
		ball.flying = true;
		if (! ball.hand && is_even(own_siteswap)) {
			ball.dx = -dx / 2;
		} else if (ball.hand && is_even(own_siteswap)) {
			ball.dx = dx / 2;
		} else if (! ball.hand && ! is_even(own_siteswap)) {
			ball.dx = dx;
		} else { // if (ball.hand && ! is_even(own_siteswap)) {
			ball.dx = -dx;
		}
		if (! is_even(own_siteswap)) {
			ball.hand = !ball.hand; // switch hands after throwing
		}
		ball.dy = dy(own_siteswap);
		ball.ddy = ddy; // redundant?
	}
	background(bgcolor);
	map_list(balls, (ball) => {
		if (ball.flying) {
			circle(ball.x, ball.y, r);
			ball.x += ball.dx;
			ball.y += ball.dy;
			ball.dy += ball.ddy;
			if (ball.y >= canvas.height) {
				reset_ball(ball);
			}
		}
	});
	window.requestAnimationFrame(draw);
}

// init global variables
let canvas = document.getElementById("mycanvas");
let ctx = canvas.getContext("2d");
//let siteswap = [4, 5, 3]; // TODO: form entry
//let siteswap = [5, 3];
let siteswap = [5];
let n_balls = avg(siteswap);
let balls = init_balls({}, n_balls);
let cicles = 0;
let loop_count_n = loop_count(n_balls);
let loop_count_i = loop_count(siteswap.length);

// this should be in draw()
let r = 10;
//let fgcolor = "#dd88dd"; // TODO fill circles
let bgcolor = "#ccddee";
let dx = 1.7;
let ddy = 0.15;
function dy(siteswap) {
	return - ((siteswap - 2) * 5);
}
// till here

draw();

function test_list() {
	// prints: numbers from 0 to 2, 1 and 2
	let lst = init_list({}, 3);
	map_list(lst, (elem, i) => {
		elem.i = i;
	});
	map_list(lst, (elem) => {
		console.log(elem.i);
	});
	console.log(index_list(lst, 1).i);
	console.log(filter_list(lst, (elem) => elem.i === 2).i);
}
//test_list();
