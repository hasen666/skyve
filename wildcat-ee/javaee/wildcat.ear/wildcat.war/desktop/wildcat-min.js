isc.Offline.isOffline = function() {
	return false
};
isc.setAutoDraw(false);
isc.RPCManager.fetchDataPrompt = "Contacting Server...";
isc.RPCManager.saveDataPrompt = "Contacting Server...";
isc.RPCManager.removeDataPrompt = "Contacting Server...";
isc.RPCManager.handleError = function(a, b) {
	if (isc.isA.String(a.data)) {
		isc.warn(a.data);
		return false
	} else {
		return this.Super("handleError", arguments)
	}
};
Date.setShortDisplayFormat("toEuropeanShortDate");
Date.setNormalDisplayFormat("toEuropeanShortDate");
Date.setInputFormat("DMY");
isc.ListGrid.addProperties({
	recordDrop : function(e, a, c, b) {
		if (this.getID() == b.getID()) {
			var d = this.data.slice();
			d.slideList(e, c);
			this.setData(d);
			this.markForRedraw()
		} else {
			this.transferRecords(e, a, this.canReorderRecords ? c : null, b)
		}
		if (this.recordsDropped) {
			this.recordsDropped(e, c, this, b)
		}
		return false
	},
	getFilterEditorType : function(c) {
		if (c.filterEditorType != null) {
			return c.filterEditorType
		}
		var b = isc.addProperties({}, c, {
			canEdit : c.canFilter !== false,
			length : null
		});
		if (b._constructor != null) {
			delete b._constructor
		}
		if (c.filterEditorType != null) {
			b.editorType = c.filterEditorType
		}
		isc.addProperties(b, c.filterEditorProperties);
		var a = isc.DynamicForm.getEditorType(b, this);
		return a
	}
});
var resizeTimerEvent = null;
Page.setEvent("resize", function() {
	if (WindowStack) {
		if (resizeTimerEvent) {
			Timer.clearTimeout(resizeTimerEvent)
		}
		resizeTimerEvent = Timer.setTimeout(WindowStack.resize, 50)
	}
});
DataSource.addSearchOperator({
	ID : "gEquals",
	title : "Equals",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	condition : function(d, a, e, c, b) {
		return true
	},
	compareCriteria : function(a, b) {
		return -1
	}
});
DataSource.addSearchOperator({
	ID : "gDisjoint",
	title : "Disjoint",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	condition : function(d, a, e, c, b) {
		return true
	},
	compareCriteria : function(a, b) {
		return -1
	}
});
DataSource.addSearchOperator({
	ID : "gIntersects",
	title : "Intersects",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	condition : function(d, a, e, c, b) {
		return true
	},
	compareCriteria : function(a, b) {
		return -1
	}
});
DataSource.addSearchOperator({
	ID : "gTouches",
	title : "Touches",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	compareCriteria : function(a, b) {
		return -1
	}
});
DataSource.addSearchOperator({
	ID : "gCrosses",
	title : "Crosses",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	condition : function(d, a, e, c, b) {
		return true
	},
	compareCriteria : function(a, b) {
		return -1
	}
});
DataSource.addSearchOperator({
	ID : "gWithin",
	title : "Within",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	compareCriteria : function(a, b) {
		return -1
	}
});
DataSource.addSearchOperator({
	ID : "gContains",
	title : "Contains",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	condition : function(d, a, e, c, b) {
		return true
	},
	compareCriteria : function(a, b) {
		return -1
	}
});
DataSource.addSearchOperator({
	ID : "gOverlaps",
	title : "Overlaps",
	fieldTypes : [ "geometry" ],
	valueType : "fieldType",
	requiresServer : false,
	condition : function(d, a, e, c, b) {
		return true
	},
	compareCriteria : function(a, b) {
		return -1
	}
});
isc.ClassFactory.defineClass("BizMap", "Canvas");
isc.BizMap.addClassMethods({
	v : 0,
	initialise : function() {
		eval(isc.BizMap.id + ".build()")
	}
});
isc.BizMap
		.addMethods({
			init : function(a) {
				this._refreshTime = 10;
				this._refreshRequired = true;
				this._refreshing = false;
				this.width = "100%";
				this.height = "100%";
				this.styleName = "googleMapDivParent", this.ID = "bizMap"
						+ isc.BizMap.v++;
				this.redrawOnResize = false;
				this.Super("init", arguments);
				this._objects = {}
			},
			getInnerHTML : function() {
				return '<div id="'
						+ this.ID
						+ '_map" style="margin:0;padding:0;height:100%">Loading Map...</div>'
			},
			draw : function() {
				if (window.google && window.google.maps) {
					if (!this.isDrawn()) {
						this.build();
						return this.Super("draw", arguments)
					}
				} else {
					isc.BizMap.id = this.ID;
					BizUtil
							.loadJS(
									"wicket/wicket.js",
									function() {
										BizUtil
												.loadJS(
														"wicket/wicket-gmap3.js",
														function() {
															BizUtil
																	.loadJS("https://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=drawing&callback=isc.BizMap.initialise")
														})
									});
					return this.Super("draw", arguments)
				}
			},
			setDataSource : function(b) {
				if (window.google && window.google.maps && this._map) {
					if (this._view) {
						this._modelName = b;
						this._moduleName = null;
						this._queryName = null;
						this._geometryBinding = null;
						var c = this._view._grids[b];
						if (c) {
						} else {
							c = {};
							this._view._grids[b] = c
						}
						c[this.getID()] = this
					} else {
						var a = b.indexOf("_");
						this._moduleName = b.substring(0, a);
						this._queryName = b.substring(a + 1);
						a = this._queryName.indexOf("_");
						this._geometryBinding = this._queryName
								.substring(a + 1);
						this._queryName = this._queryName.substring(0, a);
						this._modelName = null
					}
					this._refresh(true, false)
				} else {
					this.delayCall("setDataSource", arguments, 100)
				}
			},
			build : function() {
				if (this.isDrawn()) {
					var a = {
						zoom : 4,
						center : new google.maps.LatLng(-26, 133.5),
						mapTypeId : google.maps.MapTypeId.ROADMAP
					};
					if (this._map) {
						a.zoom = this._map.getZoom();
						a.center = this._map.getCenter();
						a.mapTypeId = this._map.getMapTypeId()
					}
					this._infoWindow = new google.maps.InfoWindow({
						content : ""
					});
					this._map = new google.maps.Map(document
							.getElementById(this.ID + "_map"), a);
					this._refresh(true, false);
					this.delayCall("_addForm", null, 1000)
				} else {
					this.delayCall("build", null, 100)
				}
			},
			_addForm : function() {
			},
			rerender : function() {
				this._refresh(false, false)
			},
			resume : function() {
				this._zoomed = false
			},
			_refresh : function(c, f) {
				if (!this._refreshRequired) {
					return
				}
				if (this._zoomed) {
					return
				}
				if (this._refreshing) {
					return
				}
				if (!this.isDrawn()) {
					return
				}
				if (!this.isVisible()) {
					return
				}
				var e = new Wkt.Wkt();
				var b = BizUtil.URL_PREFIX + "map?";
				if (this._view) {
					if (this._modelName) {
						var a = this._view.gather(false);
						b += "_c=" + a._c + "&_m=" + this._modelName
					} else {
						return
					}
				} else {
					if (this._queryName) {
						b += "_mod=" + this._moduleName + "&_q="
								+ this._queryName + "&_geo="
								+ this._geometryBinding
					} else {
						return
					}
				}
				this._refreshing = true;
				var d = this;
				RPCManager
						.sendRequest({
							showPrompt : true,
							evalResult : true,
							actionURL : b,
							httpMethod : "GET",
							callback : function(p, G, v) {
								d._refreshing = false;
								var q = G.items;
								if (f) {
									for ( var o in d._objects) {
										if (!q.containsProperty("bizId", o)) {
											var C = d._objects[o];
											for (var y = 0, u = C.overlays.length; y < u; y++) {
												C.overlays[y].setMap(null);
												C.overlays[y] = null
											}
											delete C.overlays;
											delete d._objects[o]
										}
									}
								} else {
									for ( var o in d._objects) {
										var C = d._objects[o];
										for (var y = 0, u = C.overlays.length; y < u; y++) {
											C.overlays[y].setMap(null);
											C.overlays[y] = null
										}
										delete C.overlays;
										delete d._objects[o]
									}
								}
								for (var y = 0, u = q.length; y < u; y++) {
									var B = q[y];
									var H = d._objects[B.bizId];
									if (H) {
										var w = (H.overlays.length == B.features.length);
										if (w) {
											for (var x = 0, t = H.overlays.length; x < t; x++) {
												if (H.overlays[x].geometry !== B.features[x].geometry) {
													w = false;
													break
												}
											}
										}
										if (!w) {
											for (var x = 0, t = H.overlays.length; x < t; x++) {
												H.overlays[x].setMap(null);
												H.overlays[x] = null
											}
											delete H.overlays;
											delete d._objects[o];
											H = null
										}
									}
									if (H) {
									} else {
										H = {
											overlays : []
										};
										for (var x = 0, t = B.features.length; x < t; x++) {
											var k = B.features[x];
											try {
												e.read(k.geometry)
											} catch (A) {
												if (A.name === "WKTError") {
													alert(k.geometry
															+ " is invalid WKT.");
													continue
												}
											}
											var h = {
												editable : k.editable
											};
											if (k.strokeColour) {
												h.strokeColor = k.strokeColour
											}
											if (k.fillColour) {
												h.fillColor = k.fillColour
											}
											if (k.fillOpacity) {
												h.fillOpacity = k.fillOpacity
											}
											if (k.iconDynamicImageName) {
												h.icon = {
													url : "image?_n="
															+ k.iconDynamicImageName
												};
												if (k.iconAnchorX
														&& k.iconAnchorY) {
													h.icon.anchor = new google.maps.Point(
															k.iconAnchorX,
															k.iconAnchorY);
													h.icon.origin = new google.maps.Point(
															0, 0)
												}
											}
											var z = e.toObject(h);
											H.overlays.push(z);
											z.setMap(d._map);
											if (k.zoomable) {
												z.bizId = B.bizId;
												z.geometry = k.geometry;
												z.fromTimestamp = B.fromTimestamp;
												z.toTimestamp = B.toTimestamp;
												z.photoId = B.photoId;
												z.mod = B.moduleName;
												z.doc = B.documentName;
												z.infoMarkup = B.infoMarkup;
												google.maps.event
														.addListener(
																z,
																"click",
																function(j) {
																	var I = this.infoMarkup;
																	I += '<p/><input type="button" value="Zoom" onclick="'
																			+ d.ID
																			+ ".zoom(";
																	if (this.getPosition) {
																		var l = this
																				.getPosition();
																		I += l
																				.lat()
																				+ ","
																				+ l
																						.lng()
																				+ ","
																				+ l
																						.lat()
																				+ ","
																				+ l
																						.lng()
																				+ ",'";
																		I += this.mod
																				+ "','"
																				+ this.doc
																				+ "','"
																				+ this.bizId
																				+ "')\"/>";
																		d._infoWindow
																				.open(
																						d._map,
																						this);
																		d._infoWindow
																				.setContent(I)
																	} else {
																		if (this.getPath) {
																			var i = new google.maps.LatLngBounds();
																			var M = this
																					.getPath();
																			for (var K = 0, m = M
																					.getLength(); K < m; K++) {
																				i
																						.extend(M
																								.getAt(K))
																			}
																			var J = i
																					.getNorthEast();
																			var L = i
																					.getSouthWest();
																			I += J
																					.lat()
																					+ ","
																					+ L
																							.lng()
																					+ ","
																					+ L
																							.lat()
																					+ ","
																					+ J
																							.lng()
																					+ ",'";
																			I += this.mod
																					+ "','"
																					+ this.doc
																					+ "','"
																					+ this.bizId
																					+ "')\"/>";
																			d._infoWindow
																					.setPosition(j.latLng);
																			d._infoWindow
																					.open(d._map);
																			d._infoWindow
																					.setContent(I)
																		}
																	}
																})
											}
										}
										d._objects[B.bizId] = H
									}
								}
								if (c) {
									var n = new google.maps.LatLngBounds();
									var g = false;
									for ( var s in d._objects) {
										g = true;
										var H = d._objects[s];
										var F = H.overlays;
										for (var y = 0, u = F.length; y < u; y++) {
											var z = F[y];
											if (z.getPath) {
												var r = z.getPath();
												for (var x = 0, t = r
														.getLength(); x < t; x++) {
													n.extend(r.getAt(x))
												}
											} else {
												if (z.getPosition) {
													n.extend(z.getPosition())
												}
											}
										}
									}
									if (g) {
										if (n.getNorthEast().equals(
												n.getSouthWest())) {
											var E = new google.maps.LatLng(
													n.getNorthEast().lat() + 0.01,
													n.getNorthEast().lng() + 0.01);
											var D = new google.maps.LatLng(
													n.getNorthEast().lat() - 0.01,
													n.getNorthEast().lng() - 0.01);
											n.extend(E);
											n.extend(D)
										}
										d._map.fitBounds(n)
									}
								}
							}
						})
			},
			zoom : function(l, d, n, f, q, c, g) {
				this._zoomed = true;
				var t = Math.pow(2, this._map.getZoom());
				var r = new google.maps.LatLng(this._map.getBounds()
						.getNorthEast().lat(), this._map.getBounds()
						.getSouthWest().lng());
				var p = this._map.getProjection().fromLatLngToPoint(r);
				var a = new google.maps.LatLng(l, d);
				var e = this._map.getProjection().fromLatLngToPoint(a);
				var h = new google.maps.LatLng(n, f);
				var b = this._map.getProjection().fromLatLngToPoint(h);
				var i = this.getPageRect();
				var k = Math.floor((e.x - p.x) * t) + i[0];
				var j = Math.floor((e.y - p.y) * t) + i[1];
				var o = Math.floor((b.x - p.x) * t) + i[0] - k;
				var m = Math.floor((b.y - p.y) * t) + i[1] - j;
				var s = this;
				BizUtil.getEditView(q, c, function(u) {
					WindowStack.popup([ k, j, o, m ], "Edit", true, [ u ]);
					u.editInstance(g, null, null);
					s._infoWindow.close()
				})
			}
		});
isc.defineClass("BizUtil");
isc.BizUtil.addClassProperties({
	URL_PREFIX : window.location + "",
	_modules : {},
	_unusedPickLists : [],
	PREVIOUS_VALUES_DATA_SOURCE : isc.RestDataSource.create({
		dataFormat : "json",
		dataURL : "smartprev",
		fields : [ {
			name : "value",
			type : "text"
		} ]
	})
});
BizUtil.URL_PREFIX = BizUtil.URL_PREFIX.substring(0, BizUtil.URL_PREFIX
		.lastIndexOf("/") + 1);
isc.BizUtil
		.addClassMethods({
			_currentView : null,
			getCurrentView : function() {
				return BizUtil._currentView
			},
			loadJS : function(b, d) {
				var a = document.createElement("SCRIPT");
				a.type = "text/javascript";
				a.src = b;
				if (d != null) {
					if (a.readyState) {
						a.onreadystatechange = function() {
							if (a.readyState == "loaded"
									|| a.readyState == "complete") {
								a.onreadystatechange = null;
								d()
							}
						}
					} else {
						a.onload = d
					}
				}
				var c = document.getElementsByTagName("HEAD");
				if (c[0] != null) {
					c[0].appendChild(a)
				}
			},
			addFilterRequestParams : function(h, e, d) {
				var a = d.gather(false);
				for (var f = 0, c = e.length; f < c; f++) {
					var b = e[f];
					var g = d.toDisplay(b.value, a);
					h[b.name] = g
				}
			},
			completeFilterCriteria : function(f, d, e) {
				var j = isc.addProperties({}, f);
				if (j.operator) {
				} else {
					j = DataSource.convertCriteria(j, "substring")
				}
				j = {
					_constructor : "AdvancedCriteria",
					operator : "and",
					criteria : [ j ]
				};
				var h = e.gather(false);
				for (var c = 0, b = d.length; c < b; c++) {
					var a = d[c];
					var g = e.toDisplay(a.value, h);
					j.criteria.add({
						fieldName : a.name,
						operator : a.operator,
						value : g
					})
				}
				return j
			},
			createImageButton : function(b, a, d, c) {
				return isc.IButton.create({
					width : 24,
					icon : b,
					iconAlign : "center",
					showDisabledIcon : a,
					canHover : true,
					getHoverHTML : function() {
						return d
					},
					click : c
				})
			},
			createSplitButton : function(g, d, f, e, a, h, b, c) {
				return isc.HLayout.create({
					height : 22,
					membersMargin : 1,
					members : [ isc.IButton.create({
						height : 22,
						autoFit : true,
						title : g,
						icon : d,
						showDisabledIcon : f,
						canHover : true,
						getHoverHTML : function() {
							return e
						},
						click : a
					}), isc.MenuButton.create({
						title : "",
						width : 25,
						alignMenuLeft : false,
						canHover : true,
						getHoverHTML : function() {
							return h
						},
						menu : isc.Menu.create({
							autoDraw : false,
							showShadow : true,
							shadowDepth : 10,
							target : b,
							data : c
						})
					}) ]
				})
			},
			createUploadButton : function(a) {
				return BizUtil.createSplitButton("Upload", null, false,
						"Upload content", function() {
							var b = a.form._view.gather(false);
							var c = "contentUpload.xhtml?_n="
									+ a.name.replaceAll("_", ".") + "&_c="
									+ b._c;
							if (a.form._view._b) {
								c += "&_b="
										+ a.form._view._b.replaceAll("_", ".")
							}
							WindowStack.popup(null, "Upload Content", true,
									[ isc.HTMLPane.create({
										contentsType : "page",
										contents : "Loading Page...",
										contentsURL : c
									}) ])
						}, "Other Options", null, [ {
							title : "Clear",
							icon : "icons/delete.png",
							click : function(b) {
								a.setValue(null)
							}
						} ])
			},
			createGeoLocator : function(e, c, d, f, a, b, h, i, g) {
				return isc.IButton.create({
					height : 22,
					autoFit : true,
					title : "Map",
					canHover : true,
					getHoverHTML : function() {
						return "Select or search for a map location"
					},
					click : function() {
						var q = e.gather(false);
						var j = BizUtil.URL_PREFIX;
						j += "pages/map/geolocate.jsp?";
						if (c) {
							var n = q[c];
							j += "_latitude=" + c + "&" + c + "="
									+ (n ? n : "") + "&"
						}
						if (d) {
							var p = q[d];
							j += "_longitude=" + d + "&" + d + "="
									+ (p ? p : "") + "&"
						}
						if (f) {
							var k = q[f];
							j += "_description=" + f + "&" + f + "="
									+ (k ? k : "") + "&"
						}
						if (a) {
							var l = q[a];
							j += "_address=" + a + "&" + a + "=" + (l ? l : "")
									+ "&"
						}
						if (b) {
							var o = q[b];
							j += "_city=" + b + "&" + b + "=" + (o ? o : "")
									+ "&"
						}
						if (h) {
							var m = q[h];
							j += "_state=" + h + "&" + h + "=" + (m ? m : "")
									+ "&"
						}
						if (i) {
							var s = q[i];
							j += "_postcode=" + i + "&" + i + "="
									+ (s ? s : "") + "&"
						}
						if (g) {
							var r = q[g];
							j += "_country=" + g + "&" + g + "=" + (r ? r : "")
									+ "&"
						}
						WindowStack.popup(null, "Geo Locate", true,
								[ isc.HTMLPane.create({
									contentsType : "page",
									contents : "Loading Page...",
									contentsURL : j
								}) ])
					}
				})
			},
			getEditView : function(moduleName, documentName, onViewCreated) {
				if (BizUtil._modules[moduleName]) {
				} else {
					BizUtil._modules[moduleName] = {};
					window[moduleName] = {}
				}
				var view = null;
				var documentEntry = BizUtil._modules[moduleName][documentName];
				if (documentEntry) {
					view = documentEntry._unused.pop();
					if (view) {
					} else {
						view = eval(moduleName + ".create" + documentName
								+ "()");
						view._moduleName = moduleName;
						view._documentName = documentName
					}
					BizUtil._modules[moduleName][documentName]._used.push(view);
					onViewCreated(view)
				} else {
					RPCManager
							.sendRequest({
								showPrompt : true,
								evalResult : true,
								actionURL : BizUtil.URL_PREFIX
										+ "smartgen?_mod=" + moduleName
										+ "&_doc=" + documentName,
								callback : function(rpcResponse, data,
										rpcRequest) {
									BizUtil._modules[moduleName][documentName] = {};
									BizUtil._modules[moduleName][documentName]._used = [];
									BizUtil._modules[moduleName][documentName]._unused = [];
									BizUtil.getEditView(moduleName,
											documentName, onViewCreated)
								}
							})
				}
			},
			relinquishEditView : function(b) {
				var a = BizUtil._modules[b._moduleName][b._documentName];
				a._used.remove(b);
				a._unused.push(b)
			},
			getPickList : function(d, c, b) {
				var a = BizUtil._unusedPickLists.pop();
				if (a) {
				} else {
					a = BizListGrid.create({
						isPickList : true
					})
				}
				a.setLookup(d, c, b);
				return a
			},
			relinquishPickList : function(a) {
				a.destroy()
			},
			createListGrid : function() {
				return isc.BizListGrid.create({
					margin : 2
				})
			},
			createCalendar : function() {
				return isc.Calendar.create({
					width : "100%",
					height : "100%",
					scrollToWorkDay : true,
					data : []
				})
			},
			createTreeGrid : function() {
				return isc.BizListGrid.create({
					margin : 2,
					isTree : true
				})
			},
			createMap : function() {
				return isc.BizMap.create()
			},
			popupFrame : function(c, b, d, a) {
				var e = window
						.open(
								c,
								b,
								"width="
										+ d
										+ ",height="
										+ a
										+ ",resizable=yes,scrollbars=no,toolbar=no,location=no,directories=no,status=yes,menubar=no,copyhistory=no");
				e.focus()
			}
		});
isc.RPCManager.credentialsURL = "j_security_check";
isc.RPCManager
		.addClassMethods({
			loginRequired : function(c, b, d) {
				this.transactionToResend = c;
				if (!this.loginWindow) {
					var a = [ {
						name : "loginFailure",
						type : "blurb",
						cellStyle : "formCellError",
						defaultValue : "Invalid username or password",
						colSpan : 2,
						visible : false
					} ];
					if (!BizUtil.customer) {
						a.add({
							name : "customer",
							title : "Customer",
							titleOrientation : "left",
							keyPress : function(g, f, e) {
								if (e == "Enter") {
									f.focusInItem("username");
									return false
								}
							},
							required : true
						})
					}
					a.addAll([ {
						name : "username",
						title : "Username",
						titleOrientation : "left",
						keyPress : function(g, f, e) {
							if (e == "Enter") {
								f.focusInItem("password");
								return false
							}
						},
						required : true
					}, {
						name : "password",
						title : "Password",
						titleOrientation : "left",
						type : "password",
						keyPress : function(g, f, e) {
							if (e == "Enter") {
								f.loginWindow.doLogin();
								return false
							}
						},
						required : true
					}, {
						type : "spacer"
					}, {
						type : "button",
						title : "Login",
						click : "form.loginWindow.doLogin()",
						startRow : false
					} ]);
					this.loginForm = isc.DynamicForm.create({
						numCols : 2,
						colWidths : [ 75, "*" ],
						fields : a
					});
					this.loginWindow = isc.LoginWindow
							.create({
								headerIconDefaults : {
									src : "../images/window/WILDCAT_fav.png",
									width : 16,
									height : 16
								},
								title : "Session expired - please log in",
								autoCenter : true,
								autoSize : true,
								showCloseButton : false,
								showMinimizeButton : false,
								isModal : true,
								loginForm : this.loginForm,
								items : [ isc.VLayout
										.create({
											width : 380,
											height : BizUtil.customer ? 90
													: 120,
											members : [
													isc.HLayout
															.create({
																width : "100%",
																height : BizUtil.customer ? 50
																		: 75,
																members : [
																		isc.Img
																				.create({
																					width : 150,
																					imageType : "normal",
																					src : "loginSecurityLock.gif",
																					layoutAlign : "center"
																				}),
																		this.loginForm ]
															}),
													isc.HTMLFlow
															.create({
																contents : '<table width="100%"><tr><td align=left><a href="http://www.bizhub.com.au/biz/contact.html" target="_blank"> Problems logging in? </a></td><td align=right><a href="http://www.bizhub.com.au/biz/TermsOfUse.html" target="_blank"> Terms of Use </a></td></tr></table>'
															}) ]
										}) ]
							});
					this.loginForm.loginWindow = this.loginWindow
				}
				if (!(this.loginWindow.isVisible() && this.loginWindow
						.isDrawn())) {
					this.loginForm.clearValues();
					this.loginForm.delayCall("focusInItem",
							BizUtil.customer ? [ "username" ] : [ "customer" ])
				}
				this.loginWindow.show();
				this.loginWindow.bringToFront()
			}
		});
isc
		.defineClass("LoginWindow", "Window")
		.addProperties(
				{
					doLogin : function() {
						if (this.loginForm.validate(false)) {
							isc.RPCManager
									.sendRequest({
										containsCredentials : true,
										actionURL : isc.RPCManager.credentialsURL,
										useSimpleHttp : true,
										showPrompt : false,
										params : {
											j_username : (BizUtil.customer ? BizUtil.customer
													: this.loginForm
															.getValue("customer"))
													+ "/"
													+ this.loginForm
															.getValue("username"),
											j_password : this.loginForm
													.getValue("password")
										},
										callback : this.getID()
												+ ".loginReply(rpcResponse)"
									})
						}
					},
					loginReply : function(b) {
						this.loginForm.clearValues();
						var a = b.status;
						if (a == isc.RPCResponse.STATUS_SUCCESS) {
							this.loginForm.hideItem("loginFailure");
							this.hide();
							isc.RPCManager.delayCall("resendTransaction",
									[ this.transactionToResend ]);
							delete this.transactionsToResubmit
						} else {
							if (a == isc.RPCResponse.STATUS_LOGIN_INCORRECT) {
								this.loginForm.showItem("loginFailure")
							} else {
								if (a == isc.RPCResponse.STATUS_MAX_LOGIN_ATTEMPTS_EXCEEDED) {
									isc.warn("Max login attempts exceeded.")
								}
							}
						}
						this.loginForm
								.focusInItem(BizUtil.customer ? "username"
										: "customer")
					}
				});
isc.addMethods(Date.prototype, {
	toDD_MM_YYYY : function() {
		return this.getDate().stringify() + "/"
				+ (this.getMonth() + 1).stringify() + "/" + this.getFullYear()
	},
	toDD_MMM_YYYY : function() {
		var a = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
				"Sep", "Oct", "Nov", "Dec" ];
		return this.getDate().stringify() + "-" + a[this.getMonth()] + "-"
				+ this.getFullYear()
	},
	toDD_MM_YYYY_HH_MI : function() {
		return this.toDD_MM_YYYY() + " " + this.getHours().stringify() + ":"
				+ this.getMinutes().stringify()
	},
	toDD_MMM_YYYY_HH_MI : function() {
		return this.toDD_MMM_YYYY() + " " + this.getHours().stringify() + ":"
				+ this.getMinutes().stringify()
	},
	toDD_MM_YYYY_HH_MI_SS : function() {
		return this.toDD_MM_YYYY_HH_MI() + ":" + this.getSeconds().stringify()
	},
	toDD_MMM_YYYY_HH_MI_SS : function() {
		return this.toDD_MMM_YYYY_HH_MI() + ":" + this.getSeconds().stringify()
	}
});
isc.ClassFactory.defineClass("BizDateItem", "DateItem");
BizDateItem
		.addClassMethods({
			parseInput : function(d) {
				if (isc.isA.Date(d)) {
					return d
				}
				if (d) {
					d = d.trim();
					var c = /^\d?\d[^A-Za-z0-9]([A-Za-z]+).*$/.exec(d);
					if (c) {
						var e = c[1];
						var b = e.toLowerCase();
						if (b.startsWith("jan")) {
							d = d.replaceAll(e, "1")
						} else {
							if (b.startsWith("feb")) {
								d = d.replaceAll(e, "2")
							} else {
								if (b.startsWith("mar")) {
									d = d.replaceAll(e, "3")
								} else {
									if (b.startsWith("apr")) {
										d = d.replaceAll(e, "4")
									} else {
										if (b.startsWith("may")) {
											d = d.replaceAll(e, "5")
										} else {
											if (b.startsWith("jun")) {
												d = d.replaceAll(e, "6")
											} else {
												if (b.startsWith("jul")) {
													d = d.replaceAll(e, "7")
												} else {
													if (b.startsWith("aug")) {
														d = d
																.replaceAll(e,
																		"8")
													} else {
														if (b.startsWith("sep")) {
															d = d.replaceAll(e,
																	"9")
														} else {
															if (b
																	.startsWith("oct")) {
																d = d
																		.replaceAll(
																				e,
																				"10")
															} else {
																if (b
																		.startsWith("nov")) {
																	d = d
																			.replaceAll(
																					e,
																					"11")
																} else {
																	if (b
																			.startsWith("dec")) {
																		d = d
																				.replaceAll(
																						e,
																						"12")
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
					var a = Date.parseSchemaDate(d);
					if (a) {
					} else {
						a = Date.parseInput(d, "DMY", 50, true);
						if (a) {
						} else {
							if (/^\d?\d[^A-Za-z0-9]\d?\d$/.test(d)) {
								a = Date.parseInput(d + " "
										+ Date.create().getFullYear(), "DMY",
										50, true)
							}
						}
					}
					return a
				} else {
					return null
				}
			},
			format : function(value, format) {
				if (!isc.isA.Date(value)) {
					return value
				}
				return eval("value." + format + "()")
			}
		});
BizDateItem.addProperties({
	enforceDate : true,
	changeOnBlur : true,
	changeOnKeypress : false,
	width : 100,
	useTextField : true,
	showHint : true,
	showHintInField : true,
	hint : "DD MM(M) YY(YY)",
	textFieldProperties : {
		selectOnFocus : true
	},
	showPickerTimeItem : false,
	inputFormat : function(a) {
		return BizDateItem.parseInput(a)
	},
	displayFormat : "toDD_MM_YYYY"
});
BizDateItem.addMethods({
	mapValueToDisplay : function(a) {
		if (a == null) {
			return isc.emptyString
		}
		if (!isc.isA.Date(a)) {
			a = BizDateItem.parseInput(a)
		}
		return BizDateItem.format(a, this.displayFormat)
	},
	mapDisplayToValue : function(a) {
		if (isc.isAn.emptyString(a)) {
			a = null
		} else {
			a = BizDateItem.parseInput(a)
		}
		return a
	},
	updateValue : function() {
		this.Super("updateValue", arguments);
		this.setElementValue(this.mapValueToDisplay(this.getValue()))
	},
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = BizDateItem.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	}
});
isc.SimpleType.create({
	name : "bizDate",
	inheritsFrom : "date",
	editorType : "BizDateItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MM_YYYY")
	}
});
isc.SimpleType.create({
	name : "DD_MM_YYYY",
	inheritsFrom : "bizDate"
});
isc.ClassFactory.defineClass("DD_MMM_YYYY_Item", "BizDateItem");
DD_MMM_YYYY_Item.addProperties({
	displayFormat : "toDD_MMM_YYYY"
});
isc.SimpleType.create({
	name : "DD_MMM_YYYY",
	inheritsFrom : "bizDate",
	editorType : "DD_MMM_YYYY_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MMM_YYYY")
	}
});
isc.ClassFactory.defineClass("BizDateTimeItem", "DateTimeItem");
BizDateTimeItem.addProperties({
	enforceDate : true,
	changeOnBlur : true,
	changeOnKeypress : false,
	width : 200,
	useTextField : true,
	showHint : true,
	showHintInField : true,
	hint : "DD MM(M) YY(YY) HH(24):MI",
	textFieldProperties : {
		selectOnFocus : true
	},
	showPickerTimeItem : true,
	pickerTimeItemProperties : {
		showSecondItem : false,
		use24HourTime : false
	},
	inputFormat : function(a) {
		return BizDateItem.parseInput(a)
	},
	displayFormat : "toDD_MM_YYYY_HH_MI"
});
BizDateTimeItem.addMethods({
	mapValueToDisplay : function(a) {
		if (a == null) {
			return isc.emptyString
		}
		if (!isc.isA.Date(a)) {
			a = BizDateItem.parseInput(a)
		}
		return BizDateItem.format(a, this.displayFormat)
	},
	mapDisplayToValue : function(a) {
		if (isc.isAn.emptyString(a)) {
			a = null
		} else {
			a = BizDateItem.parseInput(a)
		}
		return a
	},
	updateValue : function() {
		this.Super("updateValue", arguments);
		this.setElementValue(this.mapValueToDisplay(this.getValue()))
	},
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = BizDateItem.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	}
});
isc.SimpleType.create({
	name : "bizDateTime",
	inheritsFrom : "dateTime",
	editorType : "BizDateTimeItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MM_YYYY_HH_MI")
	}
});
isc.SimpleType.create({
	name : "DD_MM_YYYY_HH_MI",
	inheritsFrom : "bizDateTime"
});
isc.ClassFactory.defineClass("DD_MM_YYYY_HH24_MI_Item", "BizDateTimeItem");
DD_MM_YYYY_HH24_MI_Item.addProperties({
	displayFormat : "toDD_MM_YYYY_HH_MI",
	pickerTimeItemProperties : {
		showSecondItem : false,
		use24HourTime : true
	}
});
isc.SimpleType.create({
	name : "DD_MM_YYYY_HH24_MI",
	inheritsFrom : "bizDateTime",
	editorType : "DD_MM_YYYY_HH24_MI_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MM_YYYY_HH_MI")
	}
});
isc.ClassFactory.defineClass("DD_MMM_YYYY_HH_MI_Item", "BizDateTimeItem");
DD_MMM_YYYY_HH_MI_Item.addProperties({
	displayFormat : "toDD_MMM_YYYY_HH_MI",
	pickerTimeItemProperties : {
		showSecondItem : false,
		use24HourTime : false
	}
});
isc.SimpleType.create({
	name : "DD_MMM_YYYY_HH_MI",
	inheritsFrom : "bizDateTime",
	editorType : "DD_MMM_YYYY_HH_MI_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MMM_YYYY_HH_MI")
	}
});
isc.ClassFactory.defineClass("DD_MMM_YYYY_HH24_MI_Item", "BizDateTimeItem");
DD_MMM_YYYY_HH24_MI_Item.addProperties({
	displayFormat : "toDD_MMM_YYYY_HH_MI",
	pickerTimeItemProperties : {
		showSecondItem : false,
		use24HourTime : true
	}
});
isc.SimpleType.create({
	name : "DD_MMM_YYYY_HH24_MI",
	inheritsFrom : "bizDateTime",
	editorType : "DD_MMM_YYYY_HH24_MI_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MMM_YYYY_HH_MI")
	}
});
isc.ClassFactory.defineClass("DD_MM_YYYY_HH_MI_SS_Item", "BizDateTimeItem");
DD_MM_YYYY_HH_MI_SS_Item.addProperties({
	displayFormat : "toDD_MM_YYYY_HH_MI_SS",
	hint : "DD MM(M) YY(YY) HH(24):MI(:SS)",
	pickerTimeItemProperties : {
		showSecondItem : true,
		use24HourTime : false
	}
});
isc.SimpleType.create({
	name : "DD_MM_YYYY_HH_MI_SS",
	inheritsFrom : "bizDateTime",
	editorType : "DD_MM_YYYY_HH_MI_SS_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MM_YYYY_HH_MI_SS")
	}
});
isc.ClassFactory.defineClass("DD_MM_YYYY_HH24_MI_SS_Item", "BizDateTimeItem");
DD_MM_YYYY_HH24_MI_SS_Item.addProperties({
	displayFormat : "toDD_MM_YYYY_HH_MI_SS",
	hint : "DD MM(M) YY(YY) HH(24):MI(:SS)",
	pickerTimeItemProperties : {
		showSecondItem : true,
		use24HourTime : true
	}
});
isc.SimpleType.create({
	name : "DD_MM_YYYY_HH24_MI_SS",
	inheritsFrom : "bizDateTime",
	editorType : "DD_MM_YYYY_HH24_MI_SS_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MM_YYYY_HH_MI_SS")
	}
});
isc.ClassFactory.defineClass("DD_MMM_YYYY_HH_MI_SS_Item", "BizDateTimeItem");
DD_MMM_YYYY_HH_MI_SS_Item.addProperties({
	displayFormat : "toDD_MMM_YYYY_HH_MI_SS",
	hint : "DD MM(M) YY(YY) HH(24):MI(:SS)",
	pickerTimeItemProperties : {
		showSecondItem : true,
		use24HourTime : false
	}
});
isc.SimpleType.create({
	name : "DD_MMM_YYYY_HH_MI_SS",
	inheritsFrom : "bizDateTime",
	editorType : "DD_MMM_YYYY_HH_MI_SS_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MMM_YYYY_HH_MI_SS")
	}
});
isc.ClassFactory.defineClass("DD_MMM_YYYY_HH24_MI_SS_Item", "BizDateTimeItem");
DD_MMM_YYYY_HH24_MI_SS_Item.addProperties({
	displayFormat : "toDD_MMM_YYYY_HH_MI_SS",
	hint : "DD MM(M) YY(YY) HH(24):MI(:SS)",
	pickerTimeItemProperties : {
		showSecondItem : true,
		use24HourTime : true
	}
});
isc.SimpleType.create({
	name : "DD_MMM_YYYY_HH24_MI_SS",
	inheritsFrom : "bizDateTime",
	editorType : "DD_MMM_YYYY_HH24_MI_SS_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDateItem.format(c, "toDD_MMM_YYYY_HH_MI_SS")
	}
});
TimeItem.addMethods({
	init : function() {
		this.Super("init", arguments)
	}
});
isc.ClassFactory.defineClass("BizTimeItem", "TimeItem");
BizTimeItem.addProperties({
	useTextField : true,
	use24HourTime : false,
	showHint : true,
	showHintInField : true,
	hint : "HH:MI am/pm",
	textFieldProperties : {
		selectOnFocus : true
	},
	displayFormat : "toShortTime",
	timeFormatter : "toShortTime"
});
BizTimeItem.addMethods({
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = Time.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	},
	hasAdvancedCriteria : function() {
		return false
	}
});
isc.SimpleType.create({
	name : "bizTime",
	inheritsFrom : "time",
	editorType : "BizTimeItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return Time.toShortTime(c, "toShortTime", true)
	}
});
isc.SimpleType.create({
	name : "HH_MI",
	inheritsFrom : "bizTime"
});
isc.ClassFactory.defineClass("HH_MI_SS_Item", "BizTimeItem");
HH_MI_SS_Item.addProperties({
	use24HourTime : false,
	hint : "HH:MI:SS am/pm",
	displayFormat : "toTime",
	timeFormatter : "toTime"
});
isc.SimpleType.create({
	name : "HH_MI_SS",
	inheritsFrom : "bizTime",
	editorType : "HH_MI_SS_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return Time.toTime(c, "toTime", true)
	}
});
isc.ClassFactory.defineClass("HH24_MI_Item", "BizTimeItem");
HH24_MI_Item.addProperties({
	use24HourTime : true,
	hint : "HH24:MI",
	displayFormat : "toShortPadded24HourTime",
	timeFormatter : "toShortPadded24HourTime"
});
isc.SimpleType.create({
	name : "HH24_MI",
	inheritsFrom : "bizTime",
	editorType : "HH24_MI_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return Time.toShortTime(c, "toShortPadded24HourTime", true)
	}
});
isc.ClassFactory.defineClass("HH24_MI_SS_Item", "BizTimeItem");
HH24_MI_SS_Item.addProperties({
	use24HourTime : true,
	hint : "HH24:MI:SS",
	displayFormat : "toPadded24HourTime",
	timeFormatter : "toPadded24HourTime"
});
isc.SimpleType.create({
	name : "HH24_MI_SS",
	inheritsFrom : "bizTime",
	editorType : "HH24_MI_SS_Item",
	shortDisplayFormatter : function(c, d, b, a) {
		return Time.toTime(c, "toPadded24HourTime", true)
	}
});
isc.ClassFactory.defineClass("BizDecimal2Item", "TextItem");
BizDecimal2Item.addClassMethods({
	parseInput : function(b) {
		if (isc.isA.Number(b)) {
			return b
		}
		if (b) {
			b = b.toString().trim(" ").replace(/\$|\,/g, "");
			if (isNaN(b)) {
				return ""
			} else {
				var a = parseFloat(b);
				if (a >= 1000000000000000000) {
					a = ""
				}
				return a
			}
		} else {
			return ""
		}
	},
	format : function(b, a) {
		if (!isc.isA.Number(b)) {
			return b
		}
		return b.toLocalizedString(a, ".", ",", "-")
	}
});
BizDecimal2Item.addProperties({
	changeOnBlur : true,
	changeOnKeypress : false,
	width : 100,
	showHint : false,
	selectOnFocus : true,
	decimalPlaces : 2
});
BizDecimal2Item.addMethods({
	mapValueToDisplay : function(a) {
		if (a == null) {
			return isc.emptyString
		}
		if (!isc.isA.Number(a)) {
			a = BizDecimal2Item.parseInput(a)
		}
		return BizDecimal2Item.format(a, this.decimalPlaces)
	},
	mapDisplayToValue : function(a) {
		if (isc.isAn.emptyString(a)) {
			a = null
		} else {
			a = BizDecimal2Item.parseInput(a)
		}
		return a
	},
	updateValue : function() {
		this.Super("updateValue", arguments);
		this.setElementValue(this.mapValueToDisplay(this.getValue()))
	},
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = BizDecimal2Item.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	}
});
isc.SimpleType.create({
	name : "bizDecimal2",
	inheritsFrom : "float",
	editorType : "BizDecimal2Item",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDecimal2Item.format(c, 2)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizDecimal5Item", "BizDecimal2Item");
BizDecimal5Item.addProperties({
	decimalPlaces : 5
});
isc.SimpleType.create({
	name : "bizDecimal5",
	inheritsFrom : "float",
	editorType : "BizDecimal5Item",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, value)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDecimal2Item.format(c, 5)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizDecimal10Item", "BizDecimal2Item");
BizDecimal10Item.addProperties({
	decimalPlaces : 10
});
isc.SimpleType.create({
	name : "bizDecimal10",
	inheritsFrom : "float",
	editorType : "BizDecimal10Item",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDecimal2Item.format(c, 10)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizDecimal0Item", "BizDecimal2Item");
BizDecimal0Item.addProperties({
	decimalPlaces : 0
});
isc.SimpleType.create({
	name : "bizDecimal0",
	inheritsFrom : "float",
	editorType : "BizDecimal0Item",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDecimal2Item.format(c, 0)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizDecimal1Item", "BizDecimal2Item");
BizDecimal1Item.addProperties({
	decimalPlaces : 1
});
isc.SimpleType.create({
	name : "bizDecimal1",
	inheritsFrom : "float",
	editorType : "BizDecimal1Item",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDecimal2Item.format(c, 1)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizDollarsAndCentsItem", "BizDecimal2Item");
BizDollarsAndCentsItem.addProperties({
	showHint : true,
	showHintInField : true,
	hint : "(+/-)$$$$$.cc"
});
isc.SimpleType.create({
	name : "bizDollarsAndCents",
	inheritsFrom : "float",
	editorType : "BizDollarsAndCentsItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDollarsAndCentsItem.format(c, 2)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizDollarsAndCentsItem", "BizDecimal2Item");
BizDollarsAndCentsItem.addProperties({
	showHint : true,
	showHintInField : true,
	hint : "(+/-)$$$$$.cc"
});
isc.SimpleType.create({
	name : "bizDollarsAndCents",
	inheritsFrom : "float",
	editorType : "BizDollarsAndCentsItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizDollarsAndCentsItem.format(c, 2)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizIntegerPercentageItem", "TextItem");
BizIntegerPercentageItem.addClassMethods({
	parseInput : function(b) {
		if (isc.isA.Number(b)) {
			return b
		}
		if (b) {
			b = b.toString().trim(" ").trim("%");
			if (isNaN(b)) {
				return null
			} else {
				var a = Math.round(parseFloat(b)) / 100;
				if (a >= 1000000000000000000) {
					a = null
				}
				return a
			}
		} else {
			return null
		}
	},
	format : function(a) {
		if (!isc.isA.Number(a)) {
			return a
		}
		return (a * 100).toLocalizedString(0, ".", ",", "-") + "%"
	}
});
BizIntegerPercentageItem.addProperties({
	changeOnBlur : true,
	changeOnKeypress : false,
	width : 100,
	showHint : true,
	showHintInField : true,
	hint : "(+/-)99999",
	selectOnFocus : true
});
BizIntegerPercentageItem.addMethods({
	mapValueToDisplay : function(a) {
		if (a == null) {
			return isc.emptyString
		}
		if (!isc.isA.Number(a)) {
			a = BizIntegerPercentageItem.parseInput(a)
		}
		return BizIntegerPercentageItem.format(a)
	},
	mapDisplayToValue : function(a) {
		if (isc.isAn.emptyString(a)) {
			a = null
		} else {
			a = BizIntegerPercentageItem.parseInput(a)
		}
		return a
	},
	updateValue : function() {
		this.Super("updateValue", arguments);
		this.setElementValue(this.mapValueToDisplay(this.getValue()))
	},
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = BizIntegerPercentageItem.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	}
});
isc.SimpleType.create({
	name : "bizIntegerPercentage",
	inheritsFrom : "integer",
	editorType : "BizIntegerPercentageItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizIntegerPercentageItem.format(c)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizSimplePercentageItem",
		"BizIntegerPercentageItem");
BizSimplePercentageItem.addClassMethods({
	parseInput : function(b) {
		if (isc.isA.Number(b)) {
			return b
		}
		if (b) {
			b = b.toString().trim(" ").trim("%");
			if (isNaN(b)) {
				return null
			} else {
				var a = Math.round(parseFloat(b));
				if (a >= 1000000000000000000) {
					a = null
				}
				return a
			}
		} else {
			return null
		}
	},
	format : function(a) {
		if (!isc.isA.Number(a)) {
			return a
		}
		return a.toLocalizedString(0, ".", ",", "-") + "%"
	}
});
BizSimplePercentageItem.addMethods({
	mapValueToDisplay : function(a) {
		if (a == null) {
			return isc.emptyString
		}
		if (!isc.isA.Number(a)) {
			a = BizSimplePercentageItem.parseInput(a)
		}
		return BizSimplePercentageItem.format(a)
	},
	mapDisplayToValue : function(a) {
		if (isc.isAn.emptyString(a)) {
			a = null
		} else {
			a = BizSimplePercentageItem.parseInput(a)
		}
		return a
	},
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = BizSimplePercentageItem.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	}
});
isc.SimpleType.create({
	name : "bizSimplePercentage",
	inheritsFrom : "float",
	editorType : "BizSimplePercentageItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizSimplePercentageItem.format(c)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizTwoDecimalPlacesPercentageItem",
		"BizIntegerPercentageItem");
BizTwoDecimalPlacesPercentageItem.addClassMethods({
	parseInput : function(b) {
		if (isc.isA.Number(b)) {
			return b
		}
		if (b) {
			b = b.toString().trim(" ").trim("%");
			if (isNaN(b)) {
				return null
			} else {
				var a = Math.round(parseFloat(b) * 100) / 10000;
				if (a >= 1000000000000000000) {
					a = null
				}
				return a
			}
		} else {
			return null
		}
	},
	format : function(a) {
		if (!isc.isA.Number(a)) {
			return a
		}
		return (a * 100).toLocalizedString(2, ".", ",", "-") + "%"
	}
});
BizTwoDecimalPlacesPercentageItem.addProperties({
	hint : "(+/-)99999.99"
});
BizTwoDecimalPlacesPercentageItem.addMethods({
	mapValueToDisplay : function(a) {
		if (a == null) {
			return isc.emptyString
		}
		if (!isc.isA.Number(a)) {
			a = BizTwoDecimalPlacesPercentageItem.parseInput(a)
		}
		return BizTwoDecimalPlacesPercentageItem.format(a)
	},
	mapDisplayToValue : function(a) {
		if (isc.isAn.emptyString(a)) {
			a = null
		} else {
			a = BizTwoDecimalPlacesPercentageItem.parseInput(a)
		}
		return a
	},
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = BizTwoDecimalPlacesPercentageItem.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	}
});
isc.SimpleType.create({
	name : "bizTwoDecimalPlacesPercentage",
	inheritsFrom : "float",
	editorType : "BizTwoDecimalPlacesPercentageItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizTwoDecimalPlacesPercentageItem.format(c)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
isc.ClassFactory.defineClass("BizTimeDurationItem", "TextItem");
BizTimeDurationItem.addClassMethods({
	parseInput : function(e) {
		if (isc.isA.Number(e)) {
			return e
		}
		if (e) {
			var c = /^\s*\s*([-+]?\d+)\s*\.\s*(\d?\d)?\s*$/.exec(e);
			if (c) {
				var a = parseFloat(c[1] + "." + (c[2] | 0));
				if (a >= 1000000000000000000) {
					a = null
				}
				return a
			}
			c = /^\s*\s*([-+]?\d+)\s*\D?\s*(\d?\d)?\s*$/.exec(e);
			if (c) {
				var b = parseInt(c[1] | 0, 10);
				var d = Math.min(parseInt(c[2] | 0, 10), 59);
				if (b >= 0) {
					return b + (d / 60)
				}
				return b - (d / 60)
			} else {
				return null
			}
		} else {
			return null
		}
	},
	format : function(b) {
		if (!isc.isA.Number(b)) {
			return b
		}
		var d;
		var a;
		if (b >= 0) {
			a = Math.floor(b);
			d = b - a
		} else {
			a = Math.ceil(b);
			d = Math.abs(b - a)
		}
		var c = Math.round(d * 60).toString();
		if (c.length == 1) {
			c = "0" + c
		}
		return a + ":" + c
	}
});
BizTimeDurationItem.addProperties({
	changeOnBlur : true,
	changeOnKeypress : false,
	width : 100,
	showHint : true,
	showHintInField : true,
	hint : "(+/-)HHH:MM",
	selectOnFocus : true
});
BizTimeDurationItem.addMethods({
	mapValueToDisplay : function(a) {
		if (a == null) {
			return isc.emptyString
		}
		if (!isc.isA.Number(a)) {
			a = BizTimeDurationItem.parseInput(a)
		}
		return BizTimeDurationItem.format(a)
	},
	mapDisplayToValue : function(a) {
		if (isc.isAn.emptyString(a)) {
			a = null
		} else {
			a = BizTimeDurationItem.parseInput(a)
		}
		return a
	},
	updateValue : function() {
		this.Super("updateValue", arguments);
		this.setElementValue(this.mapValueToDisplay(this.getValue()))
	},
	setValue : function(a) {
		if (isc.isA.String(a)) {
			a = BizTimeDurationItem.parseInput(a)
		}
		return this.Super("setValue", [ a ])
	}
});
isc.SimpleType.create({
	name : "bizTimeDuration",
	inheritsFrom : "float",
	editorType : "BizTimeDurationItem",
	editFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	normalDisplayFormatter : function(c, d, b, a) {
		return this.shortDisplayFormatter(c, d, b, a)
	},
	shortDisplayFormatter : function(c, d, b, a) {
		return BizTimeDurationItem.format(c)
	},
	validators : [ {
		type : "custom",
		clientOnly : true,
		condition : "(value == null) || isA.Number(value)"
	} ]
});
ClassFactory.defineClass("BizContentLinkItem", CanvasItem);
BizContentLinkItem.addProperties({
	height : 25,
	width : "*",
	rowSpan : "*",
	endRow : false,
	startRow : false,
	canFocus : true,
	shouldSaveValue : true
});
BizContentLinkItem
		.addMethods({
			init : function(a) {
				this._link = HTMLFlow.create({
					contents : "Empty",
					width : "100%"
				});
				if (a.editable) {
					this.canvas = isc.HLayout.create({
						defaultLayoutAlign : "center",
						members : [ this._link, LayoutSpacer.create({
							width : 3
						}), BizUtil.createUploadButton(this) ]
					})
				} else {
					this.canvas = isc.HLayout.create({
						defaultLayoutAlign : "center",
						members : [ this._link ]
					})
				}
				this.Super("init", arguments)
			},
			setValue : function(b) {
				if ((this.canvas != null) && (!this.userSetValue)) {
					if (b) {
						var a = BizUtil.URL_PREFIX + "content?_n=" + b
								+ "&_doc=" + this.form._view._mod + "."
								+ this.form._view._doc + "&_b="
								+ this.name.replaceAll("_", ".") + "&_ctim="
								+ new Date().getTime();
						this._link
								.setContents('<div style="line-height:25px;vertical-align:middle;">'
										+ this.canvas.linkHTML(a, "Content",
												"_blank") + "</div>")
					} else {
						this._link
								.setContents('<div style="line-height:25px;vertical-align:middle;">&lt;Empty&gt;</div>')
					}
				}
				return this.Super("setValue", [ b ])
			}
		});
isc.SimpleType.create({
	inheritsFrom : "canvas",
	name : "bizContentLink",
	editorType : "BizContentLinkItem"
});
ClassFactory.defineClass("BizContentImageItem", CanvasItem);
BizContentImageItem.addProperties({
	width : "*",
	rowSpan : "*",
	endRow : false,
	startRow : false,
	canFocus : true,
	shouldSaveValue : true
});
BizContentImageItem.addMethods({
	init : function(a) {
		this._img = Img.create({
			width : (a.width ? a.width : "100%"),
			height : (a.height ? a.height : "100%"),
			imageType : "center",
			showEdges : true,
			showDisabled : false,
			src : "[SKIN]blank.gif"
		});
		if (a.editable) {
			var b = isc.HLayout.create({
				width : 1,
				height : (a.height ? a.height : "100%"),
				defaultLayoutAlign : "center",
				members : [ BizUtil.createUploadButton(this) ]
			});
			this.canvas = isc.HLayout.create({
				defaultLayoutAlign : "center",
				members : [ this._img, LayoutSpacer.create({
					width : 5
				}), b ]
			})
		} else {
			this.canvas = isc.HLayout.create({
				defaultLayoutAlign : "center",
				members : [ this._img ]
			})
		}
		this.Super("init", arguments)
	},
	setValue : function(b) {
		if ((this.canvas != null) && (!this.userSetValue)) {
			if (b) {
				var a = BizUtil.URL_PREFIX + "content?_n=" + b + "&_doc="
						+ this.form._view._mod + "." + this.form._view._doc
						+ "&_b=" + this.name.replaceAll("_", ".") + "&_w="
						+ (this._img.getWidth() - 20) + "&_h="
						+ (this._img.getHeight() - 20) + "&_ctim="
						+ new Date().getTime();
				this._img.setSrc(a)
			} else {
				this._img.setSrc("[SKIN]blank.gif")
			}
		}
		return this.Super("setValue", [ b ])
	}
});
isc.SimpleType.create({
	inheritsFrom : "canvas",
	name : "bizContentImage",
	editorType : "BizContentImageItem"
});
ClassFactory.defineClass("BizLookupDescriptionItem", CanvasItem);
BizLookupDescriptionItem.addProperties({
	height : 20,
	width : "*",
	rowSpan : "*",
	endRow : false,
	startRow : false,
	canFocus : true,
	shouldSaveValue : true,
	fetchMissingValues : false,
	autoFetchData : false,
	canCreate : false,
	canUpdate : false,
	canPick : true,
	canEdit : true,
	canAdd : true,
	canClear : true
});
BizLookupDescriptionItem
		.addMethods({
			init : function(a) {
				var b = this;
				var c = {
					name : "_combo",
					type : "comboBox",
					showTitle : false,
					width : "*",
					height : 22,
					selectOnFocus : true,
					fetchMissingValues : false,
					autoFetchData : false,
					allowEmptyValue : a.allowEmptyValue,
					optionDataSource : a.optionDataSource,
					valueField : a.valueField,
					displayField : a.displayField,
					pickListFields : a.pickListFields,
					filterFields : a.filterFields,
					completeOnTab : true,
					textMatchStyle : "substring",
					getPickListFilterCriteria : function() {
						var d = this.Super("getPickListFilterCriteria",
								arguments);
						if (a.params) {
							d = BizUtil.completeFilterCriteria(d, a.params,
									b._view)
						}
						return d
					},
					changed : function(e, d, f) {
						if (this.getDisplayValue() == f) {
							b.Super("setValue", null)
						} else {
							b.Super("setValue", [ f ]);
							if (f) {
								b.bizPicked(b.form, b, f)
							}
						}
					},
					blur : function(e, d) {
						if (b.getValue() == null) {
							d.setValue("")
						}
					},
					valueMap : {}
				};
				if (a.editable) {
					this._form = isc.DynamicForm.create({
						writeFormTag : false,
						numCols : 2,
						colWidths : [ "*", 60 ]
					});
					this._splitButton = BizUtil
							.createSplitButton(
									"Pick",
									null,
									false,
									"Pick a record",
									function() {
										var d = BizUtil.getPickList(b,
												a.params, b._view);
										d.setDataSource(a.optionDataSource);
										WindowStack.popup(b.getPageRect(),
												"Pick", true, [ d ])
									},
									"Other Options",
									this._form,
									[
											{
												title : "Edit",
												icon : "icons/zoom.gif",
												click : function(d) {
													b.zoom(false)
												},
												enableIf : function(e, f, d) {
													return (b.canUpdate
															&& b.canEdit && (b
															.getValue() != null))
												}
											},
											{
												title : "New",
												icon : "icons/new.png",
												click : function(d) {
													if (a && a.params) {
														var e = {};
														BizUtil
																.addFilterRequestParams(
																		e,
																		a.params,
																		b._view);
														b.zoom(true, e)
													} else {
														b.zoom(true)
													}
												},
												enableIf : function(e, f, d) {
													return b.canCreate
															&& b.canAdd
												}
											},
											{
												title : "Clear",
												icon : "icons/delete.png",
												click : function(d) {
													b.setValue(null);
													b.bizCleared(b.form, b,
															null)
												},
												enableIf : function(e, f, d) {
													return b.canClear
												}
											} ]);
					this._form.setItems([ c, {
						name : "_splitButton",
						showTitle : false,
						type : "canvas",
						canvas : this._splitButton
					} ])
				} else {
					this._form = isc.DynamicForm.create({
						writeFormTag : false,
						numCols : 1,
						colWidths : [ "*" ]
					});
					this._form.setItems([ c ])
				}
				this.canvas = this._form;
				this.Super("init", arguments)
			},
			setValue : function(a) {
				if (this.canvas != null) {
					if (this.userSetValue) {
						this.bizPicked(this.form, this, a)
					} else {
						this._form.getItem("_combo").setValue(a)
					}
				}
				return this.Super("setValue", [ a ])
			},
			bizAdded : function(b, a, c) {
			},
			bizEdited : function(b, a, c) {
			},
			bizPicked : function(b, a, c) {
			},
			bizCleared : function(b, a, c) {
			},
			invalidateCache : function() {
				var a = this._form.getItem("_combo").optionDataSource;
				if (a) {
					if (a.invalidateCache) {
						a.invalidateCache()
					}
				}
			},
			setValueMapFromEditView : function(a) {
				this._setValueMap(a[this.name], a[this.name + "_"
						+ this.displayField])
			},
			setValueMapFromPickList : function(a) {
				this._setValueMap(a.bizId, a[this.displayField])
			},
			_setValueMap : function(a, b) {
				if (a) {
					var c = {};
					c[a] = b ? b : "<unknown>";
					this._form.getItem("_combo").setValueMap(c)
				}
			},
			enableDisablePick : function() {
				this._form.getItem("_combo").setDisabled(!this.canPick);
				if (this._splitButton) {
					this._splitButton.getMember(0).setDisabled(!this.canPick)
				}
			},
			zoom : function(a, f) {
				var d = this;
				var b = DataSource.get(this.optionDataSource).modoc;
				var c = b.indexOf(".");
				var e = b.substring(c + 1);
				b = b.substring(0, c);
				BizUtil
						.getEditView(
								b,
								e,
								function(h) {
									var j = (d._view._b) ? d._view._b + "."
											+ d.name : d.name;
									var i = d.getPageRect();
									if (a) {
										var k = d.required;
										if (k) {
											d.setRequired(false)
										}
										var g = d._view.gather(true);
										if (g) {
										} else {
											isc
													.warn("You cannot zoom in until you fix the problems found")
										}
										if (g._apply
												|| d._view._vm
														.valuesHaveChanged()) {
											delete g._apply;
											d._view.saveInstance(null,
													function() {
														d.setRequired(k);
														WindowStack.popup(i,
																"New", false,
																[ h ]);
														h.newInstance(f, j,
																g._c, false)
													})
										} else {
											d.setRequired(k);
											WindowStack.popup(i, "New", false,
													[ h ]);
											h.newInstance(f, j, g._c, false)
										}
									} else {
										var g = d._view.gather(true);
										if (g) {
										} else {
											isc
													.warn("You cannot zoom in until you fix the problems found")
										}
										if (g._apply
												|| d._view._vm
														.valuesHaveChanged()) {
											delete g._apply;
											d._view.saveInstance(null,
													function() {
														WindowStack.popup(i,
																"Edit", false,
																[ h ]);
														h.editInstance(d
																.getValue(), j,
																g._c, false)
													})
										} else {
											WindowStack.popup(i, "Edit", false,
													[ h ]);
											h.editInstance(d.getValue(), j,
													g._c, false)
										}
									}
								})
			}
		});
isc.SimpleType.create({
	inheritsFrom : "comboBox",
	name : "bizLookupDescription",
	editorType : "BizLookupDescriptionItem"
});
var CKEDITOR = null;
ClassFactory.defineClass("BizHTMLItem", CanvasItem);
BizHTMLItem.addProperties({
	width : "*",
	height : "200px",
	rowSpan : "*",
	endRow : false,
	startRow : false,
	canFocus : true,
	shouldSaveValue : true
});
BizHTMLItem
		.addMethods({
			init : function(a) {
				this._pane = HTMLPane.create({
					width : a.width,
					height : a.height,
					showEdges : true,
					contents : "Empty"
				});
				var b = this;
				this._editButton = isc.IButton
						.create({
							height : 22,
							width : 30,
							title : "Edit",
							canHover : true,
							getHoverHTML : function() {
								return "Edit the HTML"
							},
							click : function(c) {
								if (CKEDITOR) {
									this._show()
								} else {
									$LAB.script("ckeditor332/ckeditor.js")
											.wait(function() {
												b._editButton._show()
											})
								}
							},
							_show : function() {
								var c = b.form._view;
								var e = c.gather(false);
								var d = Canvas.create({
									width : "100%",
									height : "100%"
								});
								d
										.setContents('<div style="width:100%;height:100%" id="_CKEditor"></div>');
								d.draw = function() {
									this.Super("draw");
									b._editor = CKEDITOR
											.replace(
													"_CKEditor",
													{
														customConfig : "",
														resize_enabled : false,
														skin : "v2",
														autoUpdateElement : false,
														baseFloatZIndex : 9000000,
														filebrowserImageBrowseUrl : "pages/htmlEdit/browseImages.jsp?_doc="
																+ c._mod
																+ "."
																+ c._doc
																+ "&_id="
																+ e.bizId,
														filebrowserBrowseUrl : "pages/htmlEdit/browseDocuments.jsp?_doc="
																+ c._mod
																+ "."
																+ c._doc
																+ "&_id="
																+ e.bizId,
														toolbar : [
																[
																		"Source",
																		"-",
																		"NewPage",
																		"Preview" ],
																[
																		"Cut",
																		"Copy",
																		"Paste",
																		"PasteText",
																		"PasteFromWord",
																		"-",
																		"Print",
																		"SpellChecker",
																		"Scayt" ],
																[
																		"Undo",
																		"Redo",
																		"-",
																		"Find",
																		"Replace",
																		"-",
																		"SelectAll",
																		"RemoveFormat" ],
																"/",
																[
																		"Bold",
																		"Italic",
																		"Underline",
																		"Strike",
																		"-",
																		"Subscript",
																		"Superscript" ],
																[
																		"NumberedList",
																		"BulletedList",
																		"-",
																		"Outdent",
																		"Indent",
																		"Blockquote",
																		"CreateDiv" ],
																[
																		"JustifyLeft",
																		"JustifyCenter",
																		"JustifyRight",
																		"JustifyBlock" ],
																[
																		"Link",
																		"Unlink",
																		"Anchor" ],
																[
																		"Image",
																		"Flash",
																		"Table",
																		"HorizontalRule",
																		"Smiley",
																		"SpecialChar",
																		"PageBreak" ],
																"/",
																[ "Format",
																		"Font",
																		"FontSize" ],
																[ "TextColor",
																		"BGColor" ],
																[ "Maximize",
																		"ShowBlocks" ] ]
													});
									b._editor.setData(b.getValue());
									return this
								};
								WindowStack
										.popup(
												null,
												"Edit HTML",
												true,
												[
														d,
														isc.HLayout
																.create({
																	membersMargin : 5,
																	margin : 10,
																	align : "right",
																	members : [
																			isc.IButton
																					.create({
																						height : 22,
																						width : 60,
																						title : "Apply",
																						click : function(
																								f) {
																							b
																									.setValue(b._editor
																											.getData());
																							WindowStack
																									.popoff(false)
																						}
																					}),
																			isc.IButton
																					.create({
																						height : 22,
																						width : 60,
																						title : "Cancel",
																						click : function(
																								f) {
																							WindowStack
																									.popoff(false)
																						}
																					}) ]
																}) ], 375)
							}
						});
				this.canvas = isc.HLayout.create({
					defaultLayoutAlign : "center",
					members : [ this._pane, LayoutSpacer.create({
						width : 3
					}), this._editButton ]
				});
				this.Super("init", arguments)
			},
			setValue : function(a) {
				if ((this.canvas != null) && (!this.userSetValue)) {
					if (a) {
						this._pane.setContents(a)
					} else {
						this._pane.setContents("Empty")
					}
				}
				return this.Super("setValue", [ a ])
			}
		});
isc.SimpleType.create({
	inheritsFrom : "canvas",
	name : "bizHTML",
	editorType : "BizHTMLItem"
});
isc.ClassFactory.defineClass("BizMapPicker", "HTMLFlow");
isc.BizMapPicker.addClassMethods({
	v : 0,
	initialise : function() {
		eval(isc.BizMapPicker.id + ".build()")
	}
});
isc.BizMapPicker
		.addMethods({
			init : function(a) {
				this.width = "100%";
				this.height = "100%";
				this.styleName = "googleMapDivParent";
				this.ID = "bizMapPicker" + isc.BizMapPicker.v++;
				this.contents = '<div id="'
						+ this.ID
						+ '_map" style="margin:0;padding:0;height:100%">Loading Map...</div>';
				this.Super("init", arguments);
				this._overlays = [];
				this.field = a.field;
				if (window.google && window.google.maps) {
					this.build()
				} else {
					isc.BizMapPicker.id = this.ID;
					BizUtil
							.loadJS(
									"wicket/wicket.js",
									function() {
										BizUtil
												.loadJS(
														"wicket/wicket-gmap3.js",
														function() {
															BizUtil
																	.loadJS("https://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=drawing&callback=isc.BizMapPicker.initialise")
														})
									})
				}
			},
			mapIt : function() {
				var f = this.field.getValue();
				if (f) {
				} else {
					return
				}
				var d = new Wkt.Wkt();
				try {
					d.read(f)
				} catch (j) {
					if (j.name === "WKTError") {
						alert("The WKT string is invalid.");
						return
					}
				}
				var h = d.toObject(this._map.defaults);
				if (d.type === "polygon" || d.type === "linestring") {
				} else {
					if (h.setEditable) {
						h.setEditable(false)
					}
				}
				if (Wkt.isArray(h)) {
					for (b in h) {
						if (h.hasOwnProperty(b) && !Wkt.isArray(h[b])) {
							h[b].setMap(this._map);
							this._overlays.push(h[b])
						}
					}
				} else {
					h.setMap(this._map);
					this._overlays.push(h)
				}
				if (h.getBounds !== undefined
						&& typeof h.getBounds === "function") {
					this._map.fitBounds(h.getBounds())
				} else {
					if (h.getPath !== undefined
							&& typeof h.getPath === "function") {
						var c = new google.maps.LatLngBounds();
						var g = h.getPath();
						for (var b = 0, a = g.getLength(); b < a; b++) {
							c.extend(g.getAt(b))
						}
						this._map.fitBounds(c)
					} else {
						if (h.getPosition !== undefined
								&& typeof h.getPosition === "function") {
							this._map.panTo(h.getPosition())
						}
						if (this._map.getZoom() < 15) {
							this._map.setZoom(15)
						}
					}
				}
			},
			clearIt : function() {
				for (var b = 0, a = this._overlays.length; b < a; b++) {
					this._overlays[b].setMap(null)
				}
				this._overlays.length = 0
			},
			build : function() {
				if (this.isDrawn()) {
					var a = {
						zoom : 4,
						center : new google.maps.LatLng(-26, 133.5),
						mapTypeId : google.maps.MapTypeId.ROADMAP
					};
					var c = {
						editable : true,
						strokeColor : "#990000",
						fillColor : "#EEFFCC",
						fillOpacity : 0.6
					};
					this._map = new google.maps.Map(document
							.getElementById(this.ID + "_map"), a);
					this._map.drawingManager = new google.maps.drawing.DrawingManager(
							{
								drawingControlOptions : {
									position : google.maps.ControlPosition.TOP_CENTER,
									defaults : c,
									drawingModes : [
											google.maps.drawing.OverlayType.MARKER,
											google.maps.drawing.OverlayType.POLYLINE,
											google.maps.drawing.OverlayType.POLYGON,
											google.maps.drawing.OverlayType.RECTANGLE ]
								},
								markerOptions : c,
								polygonOptions : c,
								polylineOptions : c,
								rectangleOptions : c
							});
					this._map.drawingManager.setMap(this._map);
					var b = this;
					google.maps.event.addListener(this._map.drawingManager,
							"overlaycomplete", function(f) {
								b.clearIt();
								this.setDrawingMode(null);
								b._overlays.push(f.overlay);
								var e = new Wkt.Wkt();
								e.fromObject(f.overlay);
								var d = e.write();
								b.field.setValue(d)
							});
					this.clearIt();
					this.mapIt()
				} else {
					this.delayCall("build", null, 100)
				}
			}
		});
isc.ClassFactory.defineClass("GeometryItem", "TextItem");
GeometryItem.addClassProperties({
	validOperators : [ "gWithin", "gContains", "gOverlaps", "gDisjoint",
			"gIntersects", "gTouches", "gCrosses", "gEquals" ]
});
GeometryItem.addClassMethods({
	format : function(a) {
		if (a) {
			if (a.startsWith("POINT")) {
				return "Point"
			} else {
				if (a.startsWith("LINESTRING")) {
					return "Line"
				} else {
					if (a.startsWith("POLYGON")) {
						return "Polygon"
					}
				}
			}
		}
		return ""
	}
});
GeometryItem.addProperties({
	width : 100,
	operator : "gWithin",
	validOperators : GeometryItem.validOperators,
	selectOnFocus : true
});
GeometryItem.addMethods({
	init : function(a) {
		this.icons = [ {
			src : "icons/map.png",
			prompt : "Click to set or see the geometry on a map",
			click : function(d, c, b) {
				WindowStack.popup(c.getPageRect(), "Map", true,
						[ isc.BizMapPicker.create({
							field : c
						}) ])
			}
		} ];
		if (a.icons) {
			this.icons.addList(a.icons)
		}
		this.Super("init", arguments)
	}
});
isc.SimpleType.create({
	name : "geometry",
	inheritsFrom : "text",
	editorType : "GeometryItem",
	validOperators : GeometryItem.validOperators
});
ClassFactory.defineClass("WindowStack");
WindowStack.addClassProperties({
	_margin : 0,
	_stack : [],
	_unused : [],
	popup : function(e, i, b, h, j, c, g) {
		WindowStack._margin += 50;
		var k = WindowStack._unused.pop();
		var f = c || j;
		var d = c ? c : (Page.getWidth() - WindowStack._margin);
		var a = j ? j : (Page.getHeight() - WindowStack._margin);
		if (k) {
			k.setTitle(i);
			k.sizeSet = f;
			if (h) {
				k.addItems(h)
			}
			k.setWidth(d);
			k.setHeight(a);
			k.closeClick = function() {
				WindowStack.popoff(g ? true : false)
			}
		} else {
			k = isc.Window.create({
				headerIconDefaults : {
					src : "../images/window/WILDCAT_fav.png",
					width : 16,
					height : 16
				},
				autoCenter : true,
				isModal : true,
				showModalMask : true,
				showMinimizeButton : false,
				modalMaskOpacity : 25,
				canDragReposition : true,
				canDragResize : true,
				showShadow : true,
				shadowSoftness : 10,
				shadowOffset : 0,
				title : i,
				items : h,
				width : d,
				height : a,
				sizeSet : f,
				closeClick : function() {
					WindowStack.popoff(g ? true : false)
				}
			})
		}
		k.setShowCloseButton(b);
		k._fromRect = e;
		WindowStack._stack.push(k);
		k.show()
	},
	popoff : function(d) {
		var g = WindowStack.getOpener();
		var a = WindowStack._stack.pop();
		if (a) {
			WindowStack._animateClose(a);
			var c = a.items;
			if (c) {
				if (CKEDITOR && CKEDITOR.instances._CKEditor) {
					CKEDITOR.instances._CKEditor.destroy();
					c[0].destroy()
				} else {
					for (var e = 0, b = c.length; e < b; e++) {
						var f = c[e];
						if (f._vm) {
							BizUtil.relinquishEditView(f)
						} else {
							if (isA.BizListGrid(f)) {
								BizUtil.relinquishPickList(f)
							}
						}
					}
				}
				a.removeItems(c)
			}
			WindowStack._unused.push(a);
			WindowStack._margin -= 50;
			if (g) {
				if (g.resume) {
					g.resume()
				}
				if (d && g.rerender) {
					g.rerender()
				}
			}
		}
	},
	getOpener : function() {
		if (WindowStack._stack.length <= 1) {
			return BizUtil.getCurrentView()
		}
		return WindowStack._stack[WindowStack._stack.length - 2].items[0]
	},
	resize : function() {
		var b = Page.getWidth() - 50;
		var d = Page.getHeight() - 50;
		for (var a = 0; a < WindowStack._stack.length; a++) {
			var c = WindowStack._stack[a];
			if (c.sizeSet) {
			} else {
				c.setWidth(b);
				c.setHeight(d);
				b -= 50;
				d -= 50
			}
		}
	},
	_wireframe : isc.Canvas.create({
		border : "3px ridge #E1E1E1",
		backgroundColor : "whitesmoke",
		opacity : 75,
		autoDraw : false
	}),
	_animateClosedDuration : 400,
	_animateClose : function(c) {
		if (c._fromRect) {
			var d, a, e, b;
			d = c.getLeft();
			a = c.getTop();
			e = c.getVisibleWidth();
			b = c.getVisibleHeight();
			WindowStack._wireframe.setRect([ d, a, e, b ]);
			WindowStack._wireframe.show();
			WindowStack._wireframe.bringToFront()
		}
		c.hide();
		if (c._fromRect) {
			WindowStack._wireframe.animateRect(c._fromRect[0], c._fromRect[1],
					c._fromRect[2], c._fromRect[3],
					"WindowStack._wireframe.hide();",
					WindowStack._animateClosedDuration)
		}
	}
});
ClassFactory.defineClass("ReportDialog");
ReportDialog.addClassProperties({
	_pageFormats : {
		LETTER : {
			width : 612,
			height : 792
		},
		NOTE : {
			width : 540,
			height : 720
		},
		LEGAL : {
			width : 612,
			height : 1008
		},
		A0 : {
			width : 2380,
			height : 3368
		},
		A1 : {
			width : 1684,
			height : 2380
		},
		A2 : {
			width : 1190,
			height : 1684
		},
		A3 : {
			width : 842,
			height : 1190
		},
		A4 : {
			width : 595,
			height : 842
		},
		A5 : {
			width : 421,
			height : 595
		},
		A6 : {
			width : 297,
			height : 421
		},
		A7 : {
			width : 210,
			height : 297
		},
		A8 : {
			width : 148,
			height : 210
		},
		A9 : {
			width : 105,
			height : 148
		},
		A10 : {
			width : 74,
			height : 105
		},
		B0 : {
			width : 2836,
			height : 4008
		},
		B1 : {
			width : 2004,
			height : 2836
		},
		B2 : {
			width : 1418,
			height : 2004
		},
		B3 : {
			width : 1002,
			height : 1418
		},
		B4 : {
			width : 709,
			height : 1002
		},
		B5 : {
			width : 501,
			height : 709
		},
		ARCH_E : {
			width : 595,
			height : 842
		},
		ARCH_D : {
			width : 595,
			height : 842
		},
		ARCH_C : {
			width : 595,
			height : 842
		},
		ARCH_B : {
			width : 595,
			height : 842
		},
		ARCH_A : {
			width : 595,
			height : 842
		},
		FLSA : {
			width : 612,
			height : 936
		},
		FLSE : {
			width : 612,
			height : 936
		},
		HALFLETTER : {
			width : 396,
			height : 612
		},
		"11x17" : {
			width : 792,
			height : 1224
		},
		LEDGER : {
			width : 1224,
			height : 792
		}
	},
	_available : [ {
		name : "title",
		title : "Column",
		required : true
	}, {
		name : "line",
		title : "Line",
		type : "integer",
		editorType : "spinner",
		editorProperties : {
			min : 1,
			max : 9,
			step : 1,
			defaultValue : 1,
			validators : [ {
				type : "integerRange",
				min : 1,
				max : 9
			} ]
		},
		width : 50
	}, {
		name : "width",
		title : "Width",
		type : "integer",
		editorType : "spinner",
		editorProperties : {
			min : 1,
			max : 9999,
			step : 10,
			defaultValue : 1,
			validators : [ {
				type : "integerRange",
				min : 1,
				max : 9999
			} ]
		},
		width : 50
	} ],
	_selected : [ {
		name : "title",
		title : "Column",
		required : true
	}, {
		name : "line",
		title : "Line",
		type : "integer",
		editorType : "spinner",
		editorProperties : {
			min : 1,
			max : 9,
			step : 1,
			defaultValue : 1,
			validators : [ {
				type : "integerRange",
				min : 1,
				max : 9
			} ]
		},
		width : 50
	}, {
		name : "width",
		title : "Width",
		type : "integer",
		editorType : "spinner",
		editorProperties : {
			min : 1,
			max : 9999,
			step : 10,
			defaultValue : 1,
			validators : [ {
				type : "integerRange",
				min : 1,
				max : 9999
			} ]
		},
		width : 50
	} ],
	_valuesManager : isc.ValuesManager.create()
});
ReportDialog.addClassProperties({
	_columnList : isc.ListGrid.create({
		width : "100%",
		height : "100%",
		canDragRecordsOut : true,
		canAcceptDroppedRecords : true,
		dragDataAction : "move",
		alternateRecordStyles : true,
		autoFetchData : false,
		leaveScrollbarGap : false,
		showHeaderContextMenu : false,
		fields : ReportDialog._available
	}),
	_selectedColumnList : isc.ListGrid.create({
		width : "100%",
		height : "100%",
		canDragRecordsOut : true,
		canAcceptDroppedRecords : true,
		dragDataAction : "move",
		canReorderRecords : true,
		canRemoveRecords : false,
		canEdit : true,
		editByCell : true,
		editEvent : "click",
		modalEditing : true,
		alternateRecordStyles : true,
		autoFetchData : false,
		preventDuplicates : true,
		leaveScrollbarGap : false,
		showHeaderContextMenu : false,
		fields : ReportDialog._selected
	})
});
ReportDialog.addClassProperties({
	_createReportFormatPickList : function(a, b) {
		return {
			name : "reportFormat",
			showTitle : false,
			type : "select",
			width : 300,
			required : true,
			valueMap : {
				pdf : "PDF (Adobe Portable Document Format)",
				docx : "DOCX (Word Document - Office 2007)",
				xlsx : "XLSX (Excel Document - Office 2007)",
				pptx : "PPTX (Powerpoint Document - Office 2007)",
				xls : "XLS (Excel - 98-2003)",
				rtf : "RTF (Rich Text Format)",
				ods : "ODS (Open Document Spreadsheet Format)",
				odt : "ODT (Open Document Text Format)",
				html : "HTML (Hyper Text Markup Language)",
				xhtml : "XHTML (Conformant Hyper Text Markup Language)",
				csv : "CSV (Comma Separated Values)",
				xml : "XML (JRXML Format)"
			},
			imageURLPrefix : "reporting/",
			imageURLSuffix : ".png",
			valueIcons : {
				pdf : "pdf",
				docx : "rtf",
				xlsx : "xls",
				pptx : "pptx",
				xls : "xls",
				rtf : "rtf",
				odt : "oo",
				ods : "oo",
				html : "html",
				xhtml : "html",
				txt : "txt",
				csv : "csv",
				xml : "xml"
			},
			defaultValue : "pdf",
			colSpan : a,
			change : b
		}
	}
});
ReportDialog
		.addClassProperties({
			_columnSelectorLayout : isc.HLayout
					.create({
						membersMargin : 10,
						height : "100%",
						members : [
								ReportDialog._columnList,
								isc.VLayout
										.create({
											layoutAlign : "center",
											membersMargin : 10,
											height : 100,
											members : [
													isc.IButton
															.create({
																icon : "reporting/arrow_right.png",
																iconWidth : 24,
																iconHeight : 24,
																iconAlign : "center",
																showText : false,
																width : 32,
																height : 32,
																click : function() {
																	ReportDialog._selectedColumnList
																			.transferSelectedData(ReportDialog._columnList)
																},
																canHover : true,
																getHoverHTML : function() {
																	return "Move the selected columns into the report"
																}
															}),
													isc.IButton
															.create({
																icon : "reporting/arrow_left.png",
																iconWidth : 24,
																iconHeight : 24,
																iconAlign : "center",
																showText : false,
																width : 32,
																height : 32,
																click : function() {
																	ReportDialog._columnList
																			.transferSelectedData(ReportDialog._selectedColumnList)
																},
																canHover : true,
																getHoverHTML : function() {
																	return "Move the selected columns out of the report"
																}
															}) ]
										}), ReportDialog._selectedColumnList ]
					}),
			_reportFormatForm : isc.DynamicForm
					.create({
						valuesManager : ReportDialog._valuesManager,
						numCols : 7,
						colWidths : [ 60, 200, 40, 30, "*", 60, "*" ],
						padding : 15,
						items : [
								ReportDialog._createReportFormatPickList(3,
										function(c, b, d, a) {
											if ((d == "pdf") || (d == "docx")
													|| (d == "pptx")
													|| (d == "rtf")
													|| (d == "odt")) {
												c.getItem("isPaginated")
														.setValue(true);
												c.getItem("isPretty").setValue(
														true)
											} else {
												if ((d == "html")
														|| (d == "xhtml")) {
													c.getItem("isPaginated")
															.setValue(false);
													c.getItem("isPretty")
															.setValue(true)
												} else {
													c.getItem("isPaginated")
															.setValue(false);
													c.getItem("isPretty")
															.setValue(false)
												}
											}
											c.getItem("fileNameSuffix")
													.setValue("." + d)
										}),
								{
									name : "isPaginated",
									title : "Paginated Report",
									type : "checkbox",
									required : true,
									defaultValue : true
								},
								{
									name : "style",
									title : "Style",
									type : "radioGroup",
									vertical : true,
									required : true,
									rowSpan : 2,
									valueMap : {
										tabular : "Tabular",
										columnar : "Columnar"
									},
									defaultValue : "tabular",
									change : function(c, b, d, a) {
										if (d == "columnar") {
											ReportDialog._columnList
													.hideField("line");
											ReportDialog._columnList
													.hideField("width");
											ReportDialog._selectedColumnList
													.hideField("line");
											ReportDialog._selectedColumnList
													.hideField("width")
										} else {
											ReportDialog._columnList
													.showField("line");
											ReportDialog._columnList
													.showField("width");
											ReportDialog._selectedColumnList
													.showField("line");
											ReportDialog._selectedColumnList
													.showField("width")
										}
									}
								}, {
									name : "fileNameNoSuffix",
									title : "Filename",
									type : "text",
									required : true,
									width : "100%",
									defaultValue : "export"
								}, {
									name : "fileNameSuffix",
									showTitle : false,
									type : "staticText",
									startRow : false,
									endRow : false,
									defaultValue : ".pdf"
								}, {
									name : "isPretty",
									title : "Pixel Perfect",
									type : "checkbox",
									required : true,
									defaultValue : true
								} ]
					}),
			_pageFormatForm : isc.DynamicForm
					.create({
						valuesManager : ReportDialog._valuesManager,
						numCols : 10,
						padding : 15,
						items : [
								{
									name : "format",
									title : "Format",
									type : "select",
									required : true,
									width : 80,
									valueMap : [ "LETTER", "NOTE", "LEGAL",
											"A0", "A1", "A2", "A3", "A4", "A5",
											"A6", "A7", "A8", "A9", "A10",
											"B0", "B1", "B2", "B3", "B4", "B5",
											"ARCH_E", "ARCH_D", "ARCH_C",
											"ARCH_B", "ARCH_A", "FLSA", "FLSE",
											"HALFLETTER", "11x17", "LEDGER" ],
									defaultValue : "A4",
									change : function(c, b, d, a) {
										if (c.getItem("orientation").getValue() == "portrait") {
											c
													.getItem("width")
													.setValue(
															ReportDialog._pageFormats[d].width);
											c
													.getItem("height")
													.setValue(
															ReportDialog._pageFormats[d].height)
										} else {
											c
													.getItem("width")
													.setValue(
															ReportDialog._pageFormats[d].height);
											c
													.getItem("height")
													.setValue(
															ReportDialog._pageFormats[d].width)
										}
									}
								},
								{
									name : "orientation",
									title : "Orientation",
									type : "radioGroup",
									required : true,
									valueMap : {
										portrait : "Portrait",
										landscape : "Landscape"
									},
									defaultValue : "portrait",
									change : function(g, f, e, b) {
										var a = g.getItem("width");
										var d = g.getItem("height");
										var c = a.getValue();
										a.setValue(d.getValue());
										d.setValue(c)
									}
								},
								{
									name : "width",
									title : "Width",
									type : "spinner",
									required : true,
									width : 80,
									min : 1,
									max : 9999,
									step : 1,
									defaultValue : ReportDialog._pageFormats.A4.width,
									validators : [ {
										type : "integerRange",
										min : 1,
										max : 9999
									} ]
								},
								{
									name : "height",
									title : "Height",
									type : "spinner",
									required : true,
									width : 80,
									min : 1,
									max : 9999,
									step : 1,
									defaultValue : ReportDialog._pageFormats.A4.height,
									validators : [ {
										type : "integerRange",
										min : 1,
										max : 9999
									} ]
								} ]
					}),
			_marginsForm : isc.DynamicForm.create({
				valuesManager : ReportDialog._valuesManager,
				numCols : 8,
				padding : 15,
				items : [ {
					name : "top",
					title : "Top",
					type : "spinner",
					required : true,
					width : 80,
					min : 1,
					max : 9999,
					step : 1,
					defaultValue : 20,
					validators : [ {
						type : "integerRange",
						min : 1,
						max : 9999
					} ]
				}, {
					name : "bottom",
					title : "Bottom",
					type : "spinner",
					required : true,
					width : 80,
					min : 1,
					max : 9999,
					step : 1,
					defaultValue : 20,
					validators : [ {
						type : "integerRange",
						min : 1,
						max : 9999
					} ]
				}, {
					name : "left",
					title : "Left",
					type : "spinner",
					required : true,
					width : 80,
					min : 1,
					max : 9999,
					step : 1,
					defaultValue : 20,
					validators : [ {
						type : "integerRange",
						min : 1,
						max : 9999
					} ]
				}, {
					name : "right",
					title : "Right",
					type : "spinner",
					required : true,
					width : 80,
					min : 1,
					max : 9999,
					step : 1,
					defaultValue : 20,
					validators : [ {
						type : "integerRange",
						min : 1,
						max : 9999
					} ]
				} ]
			}),
			_submitForm : isc.DynamicForm.create({
				autoDraw : true,
				canSubmit : true,
				method : "POST",
				items : [ {
					name : "values",
					type : "hidden"
				}, {
					name : "_c",
					type : "hidden"
				} ]
			}),
			_layout : null,
			_criteria : null,
			_dataSourceID : null,
			_createReportPanel : function(a, b) {
				return isc.HLayout.create({
					backgroundImage : "background.png",
					backgroundRepeat : "repeat",
					membersMargin : 5,
					margin : 5,
					layoutAlign : "center",
					members : [ isc.VLayout.create({
						backgroundImage : "background.png",
						backgroundRepeat : "repeat",
						width : 120,
						height : 140,
						layoutAlign : "center",
						margin : 0,
						membersMargin : 10,
						members : [ isc.Img.create({
							imageType : "normal",
							src : "reporting/reporting.png",
							layoutAlign : "center"
						}), isc.HLayout.create({
							width : 134,
							align : "center",
							members : [ a ]
						}) ]
					}), b ]
				})
			},
			_createExport : function() {
				if (ReportDialog._exportLayout == null) {
					ReportDialog._exportLayout = isc.VLayout
							.create({
								backgroundImage : "background.png",
								backgroundRepeat : "repeat",
								height : "100%",
								width : "100%",
								autoDraw : true,
								margin : 5,
								membersMargin : 5,
								members : [
										ReportDialog
												._createReportPanel(
														isc.IButton
																.create({
																	title : "Generate",
																	click : function() {
																		if (ReportDialog._valuesManager
																				.validate()) {
																			var b = ReportDialog._valuesManager
																					.getValues();
																			b.columns = ReportDialog._selectedColumnList
																					.getData();
																			b.ds = ReportDialog._dataSourceID;
																			if (ReportDialog._criteria) {
																				b.criteria = ReportDialog._criteria
																			}
																			var c = ReportDialog._reportFormatForm
																					.getItem(
																							"reportFormat")
																					.getValue();
																			var a = ReportDialog._reportFormatForm
																					.getItem(
																							"fileNameNoSuffix")
																					.getValue();
																			ReportDialog._submitForm
																					.setValue(
																							"values",
																							isc.JSON
																									.encode(
																											b,
																											{
																												prettyPrint : false
																											}));
																			if (ReportDialog._c) {
																				ReportDialog._submitForm
																						.setValue(
																								"_c",
																								ReportDialog._c)
																			}
																			ReportDialog._submitForm
																					.setAction("export/"
																							+ a
																							+ "."
																							+ c);
																			ReportDialog._submitForm
																					.setTarget(((c === "html") || (c === "xhtml")) ? "_blank"
																							: "_self");
																			ReportDialog._submitForm
																					.submitForm()
																		}
																	}
																}),
														isc.VLayout
																.create({
																	backgroundImage : "background.png",
																	backgroundRepeat : "repeat",
																	margin : 0,
																	membersMargin : 5,
																	members : [
																			isc.VLayout
																					.create({
																						isGroup : true,
																						groupTitle : "Report Format",
																						styleName : "bizhubRoundedBorder",
																						groupBorderCSS : "1px solid #bfbfbf",
																						margin : 1,
																						groupLabelBackgroundColor : "transparent",
																						groupLabelStyleName : "bizhubBorderLabel",
																						backgroundImage : "background.png",
																						backgroundRepeat : "repeat",
																						members : [ ReportDialog._reportFormatForm ]
																					}),
																			isc.VLayout
																					.create({
																						isGroup : true,
																						groupTitle : "Page Format",
																						styleName : "bizhubRoundedBorder",
																						groupBorderCSS : "1px solid #bfbfbf",
																						margin : 1,
																						groupLabelBackgroundColor : "transparent",
																						groupLabelStyleName : "bizhubBorderLabel",
																						backgroundImage : "background.png",
																						backgroundRepeat : "repeat",
																						members : [ ReportDialog._pageFormatForm ]
																					}),
																			isc.VLayout
																					.create({
																						isGroup : true,
																						groupTitle : "Margins",
																						styleName : "bizhubRoundedBorder",
																						groupBorderCSS : "1px solid #bfbfbf",
																						margin : 1,
																						groupLabelBackgroundColor : "transparent",
																						groupLabelStyleName : "bizhubBorderLabel",
																						backgroundImage : "background.png",
																						backgroundRepeat : "repeat",
																						members : [ ReportDialog._marginsForm ]
																					}) ]
																})),
										ReportDialog._columnSelectorLayout ]
							})
				}
			},
			popupExport : function(b, c, e, d, a) {
				ReportDialog._createExport();
				ReportDialog._dataSourceID = b;
				ReportDialog._c = c;
				ReportDialog._criteria = e;
				ReportDialog._columnList.setData(d);
				ReportDialog._selectedColumnList.setData(a);
				WindowStack.popup(null, "Reporting", true,
						[ ReportDialog._exportLayout ])
			},
			popupReport : function(a, b) {
				if (ReportDialog._reportLayout == null) {
					ReportDialog._reportLayout = ReportDialog
							._createReportPanel(
									isc.IButton
											.create({
												title : "View",
												ID : "_reportViewButton",
												_view : null,
												_params : null,
												click : function() {
													var e = this._view
															.gather(false);
													if (e) {
														var k = e._c;
														var d = this._view._b;
														var g = e.bizId;
														var h = _reportForm
																.getValue("reportFormat");
														var j = "report/"
																+ this._params._n
																+ "."
																+ h
																+ "?_format="
																+ h
																+ (k ? "&_c="
																		+ k
																		: "")
																+ (d ? "&_b="
																		+ d
																		: "")
																+ (g ? "&_id="
																		+ g
																		: "");
														if (this._params) {
															for ( var f in this._params) {
																var i = this._params[f];
																j += "&"
																		+ f
																		+ "="
																		+ this._view
																				.toDisplay(
																						i,
																						e)
															}
														}
														if ((h === "html")
																|| (h === "xhtml")) {
															window
																	.open(
																			encodeURI(j),
																			"report",
																			"location=0,status=0,scrollbars=1,resizable=1,width=800,height=600")
														} else {
															window.location = encodeURI(j)
														}
													}
												}
											}),
									isc.DynamicForm
											.create({
												ID : "_reportForm",
												fields : [
														{
															type : "rowSpacer"
														},
														{
															type : "rowSpacer"
														},
														ReportDialog
																._createReportFormatPickList(
																		1,
																		function(
																				e,
																				d,
																				f,
																				c) {
																		}), ]
											}))
				}
				_reportViewButton._view = a;
				_reportViewButton._params = b;
				WindowStack.popup(null, "Report", true,
						[ ReportDialog._reportLayout ], 175, 450)
			}
		});
isc.defineClass("AdvancedFilter", "VLayout");
isc.AdvancedFilter.addProperties({
	width : "100%",
	height : 1,
	overflow : "visible",
	membersMargin : 2,
	margin : 2,
	filterableComponent : null,
	filterableComponentConfig : null,
	toggleButton : null,
	_filterBuilder : null,
	_filterButtonDefaults : null
});
isc.AdvancedFilter
		.addMethods({
			initWidget : function() {
				this._filterButtonDefaults = {
					_constructor : isc.IButton,
					autoFit : true,
					title : "Filter",
					icon : "../images/icons/filter_add.png"
				};
				this.Super("initWidget", arguments);
				this.toggleButton = isc.ImgButton.create({
					size : 20,
					src : "../images/icons/filterButton.png",
					showRollOver : false,
					showFocused : false,
					actionType : "checkbox",
					selected : false,
					canHover : true,
					getHoverHTML : function() {
						if (this.selected) {
							return "Use <b>simple</b> filtering"
						} else {
							return "Use <b>advanced</b> filtering"
						}
					}
				});
				var a = this;
				this._styleForm = isc.DynamicForm.create({
					numCols : 2,
					width : 200,
					items : [ {
						name : "style",
						title : "Style",
						type : "radioGroup",
						vertical : false,
						required : true,
						valueMap : {
							radio : "Flat",
							bracket : "Nested",
							inline : "Inline"
						},
						defaultValue : "radio",
						changed : function(c, b, d) {
							a.setDataSource(a._filterBuilder.getDataSource())
						}
					} ]
				});
				this.addMember(this._styleForm);
				this.getStyle = function() {
					return this._styleForm.getValue("style")
				};
				this.setStyle = function(b) {
					this._styleForm.setValue("style", b);
					this.setDataSource(this._filterBuilder.getDataSource())
				}
			},
			toggleButtonClick : function() {
				if (this.toggleButton.selected) {
					this.filterableComponent.grid.setShowFilterEditor(false);
					this.show()
				} else {
					this.filterableComponent.grid
							.setFilterEditorCriteria(this._filterBuilder
									.getCriteria());
					this.filterableComponent.grid.setShowFilterEditor(true);
					this.hide()
				}
			},
			setDataSource : function(b) {
				if (this._filterBuilder) {
					this.removeMember(this._filterBuilder);
					this._filterBuilder.destroy();
					this._filterBuilder = null
				} else {
					this._filterButton = this
							.createAutoChild(
									"_filterButton",
									{
										click : function() {
											this.creator.filterableComponent.grid
													.filterData(
															this.creator._filterBuilder
																	.getCriteria(),
															null,
															{
																params : {
																	_summary : this.creator.filterableComponent.summaryType
																}
															})
										}
									});
					this.addMember(this._filterButton)
				}
				var a = this._styleForm.getValue("style");
				if (a) {
				} else {
					a = "radio"
				}
				this._filterBuilder = isc.FilterBuilder.create({
					dataSource : b,
					topOperatorAppearance : a,
					allowEmpty : true
				});
				this.addMember(this._filterBuilder, 1);
				if (this.toggleButton.selected) {
					this.show()
				} else {
					this.hide()
				}
			},
			getCriteria : function() {
				if (this._filterBuilder) {
					return this._filterBuilder.getCriteria()
				} else {
					return null
				}
			},
			clearCriteria : function() {
				if (this._filterBuilder) {
					this._filterBuilder.clearCriteria()
				}
			},
			setCriteria : function(a) {
				if (this._filterBuilder) {
					this._filterBuilder.setCriteria(a)
				}
			}
		});
isc.ClassFactory.defineClass("BizGrid", "VLayout");
BizGrid.addProperties({
	title : null,
	grid : null,
	_eventRowNum : null,
	_eventColumnNum : null,
	_eventRecord : null,
	_disabled : false,
	deleteSelectionItem : null,
	deleteSelectionButton : null,
	clearSelectionItem : null,
	canCreate : false,
	canUpdate : false,
	canDelete : false,
	canAdd : true,
	canEdit : true,
	canZoom : true,
	canRemove : true
});
BizGrid.addMethods({
	initWidget : function() {
		this.Super("initWidget", arguments);
		var a = this;
		a.deleteSelectionItem = {
			title : "Delete/Remove Selected",
			icon : "../images/icons/delete.png",
			enableIf : function(c, d, b) {
				return ((!a._disabled) && a.canDelete && a.canRemove && a.grid
						.anySelected())
			},
			click : function() {
				isc.ask("Do you want to delete/remove the selected rows?",
						function(d) {
							if (d) {
								var c = {};
								if (a._view) {
									var b = a._view.gather(false);
									c.params = {
										_c : b._c
									}
								}
								a.grid.removeSelectedData(function() {
									a.grid.selectionChanged(null, false);
									a._eventRowNum = null;
									a._eventColumnNum = null;
									a._eventRecord = null;
									if (a._view) {
										if (a._b) {
											a._view._vm.setValue("_changed",
													true);
											a._view._vm
													.setValue("_apply", true)
										}
										if (a.bizRemoved) {
											a.bizRemoved()
										}
									}
								}, c)
							}
						})
			}
		};
		a.deleteSelectionButton = BizUtil.createImageButton(
				a.deleteSelectionItem.icon, true,
				"<b>Delete/Remove</b> selected.", a.deleteSelectionItem.click);
		a.deleteSelectionButton.setDisabled(true);
		a.clearSelectionItem = {
			title : "Deselect all",
			icon : "../images/icons/clearSelection.png",
			click : function() {
				a.grid.deselectAllRecords();
				a._eventRowNum = null;
				a._eventColumnNum = null;
				a._eventRecord = null
			}
		}
	},
	refresh : function() {
		this.grid.refresh()
	}
});
isc.ClassFactory.defineClass("BizListGrid", "BizGrid");
BizListGrid.addProperties({
	summaryType : "",
	tagId : null,
	_dataSource : null,
	_toolbar : null,
	_advancedFilter : null,
	_summaryGrid : null,
	_flagForm : null,
	_flagDialog : null,
	_newButton : null,
	_zoomButton : null,
	_editButton : null,
	_pickButton : null,
	showAdd : true,
	showZoom : true,
	showEdit : true,
	showRemove : true,
	showDeselect : true,
	showExport : true,
	showFilter : true,
	showSummary : true,
	showSnap : true,
	showTag : true,
	_lookup : null
});
BizListGrid
		.addMethods({
			initWidget : function(d) {
				this.Super("initWidget", arguments);
				var l = this;
				this._config = d;
				l._flagDialog = isc.Window.create({
					autoCenter : true,
					isModal : true,
					showModalMask : true,
					canDragReposition : true,
					canDragResize : false,
					showShadow : true,
					shadowSoftness : 10,
					shadowOffset : 0,
					title : "Flag",
					headerIconDefaults : {
						src : "../images/flag.gif",
						width : 16,
						height : 16
					},
					showMaximizeButton : false,
					showMinimizeButton : false,
					showHeaderIcon : true,
					items : [ isc.DynamicForm.create({
						padding : 5,
						width : "100%",
						useAllDataSourceFields : false,
						fields : [ {
							name : "bizFlagComment",
							type : "richText",
							height : 175,
							width : "100%",
							validators : [ {
								type : "lengthRange",
								min : 0,
								max : 1024,
								clientOnly : true
							} ]
						} ]
					}), isc.HLayout.create({
						padding : 10,
						membersMargin : 5,
						align : "right",
						members : [ isc.IButton.create({
							title : "Clear",
							width : 100,
							click : function() {
								var r = l._flagForm.getField("bizFlagComment");
								if (r.getValue() != "") {
									r.setValue("");
									l._flagForm.saveData(function(t, u, s) {
										if (t.status >= 0) {
											l._flagForm.reset();
											l._flagDialog.hide()
										}
									})
								}
							}
						}), isc.IButton.create({
							title : "Flag",
							width : 100,
							click : function() {
								if (l._flagForm.validate(true)) {
									l._flagForm.saveData(function(s, t, r) {
										if (s.status >= 0) {
											l._flagForm.reset();
											l._flagDialog.hide()
										}
									})
								}
							}
						}) ]
					}) ],
					width : 580,
					height : 265
				});
				var f = function() {
					var r = l._advancedFilter.toggleButton.selected ? l._advancedFilter
							.getCriteria()
							: l.grid.getFilterEditorCriteria();
					if (d && d.params) {
						r = BizUtil
								.completeFilterCriteria(r, d.params, l._view)
					}
					return r
				};
				var i = {
					title : "New",
					icon : "../images/icons/new.png",
					enableIf : function(s, t, r) {
						return ((!l._disabled) && l.canCreate && l.canAdd)
					},
					click : function() {
						if (d) {
							var r = false;
							if (d.contConv) {
								r = d.contConv
							}
							if (r) {
								var s = l._view.gather(false)._changed;
								if (s || l._view._vm.valuesHaveChanged()) {
									isc.say("There are unsaved changes in the "
											+ l._view._singular
											+ ".  Save your changes to the "
											+ l._view._singular + " first.",
											null, {
												title : "Unsaved Changes!"
											});
									return
								}
							}
							var t = {};
							if (d.params) {
								BizUtil.addFilterRequestParams(t, d.params,
										l._view)
							}
							l.zoom(true, r, t)
						} else {
							l.zoom(true, false)
						}
					}
				};
				l._zoomItem = {
					title : "Zoom",
					icon : "../images/icons/zoom.gif",
					enableIf : function(s, t, r) {
						return (l.canZoom && l.grid.anySelected())
					},
					click : function() {
						if (d && d.contConv) {
							var r = l._view.gather(false)._changed;
							if (r || l._view._vm.valuesHaveChanged()) {
								isc.say("There are unsaved changes in the "
										+ l._view._singular
										+ ".  Save your changes to the "
										+ l._view._singular + " first.", null,
										{
											title : "Unsaved Changes!"
										})
							} else {
								l.zoom(false, true)
							}
						} else {
							l.zoom(false, false)
						}
					}
				};
				var h = {
					title : "Edit",
					icon : "../images/icons/edit.png",
					enableIf : function(s, t, r) {
						return ((!l._disabled) && l.canUpdate && l.canEdit && l.grid
								.anySelected())
					},
					click : function() {
						if (l.grid.anySelected()) {
							if (l._view) {
								if (l.grid.saveRequestProperties) {
								} else {
									l.grid.saveRequestProperties = {}
								}
								if (l.grid.saveRequestProperties.params) {
								} else {
									l.grid.saveRequestProperties.params = {}
								}
								var r = l._view.gather(false);
								if (d && d.contConv) {
									if (r._changed
											|| l._view._vm.valuesHaveChanged()) {
										isc
												.say(
														"There are unsaved changes in the "
																+ l._view._singular
																+ ".  Save your changes to the "
																+ l._view._singular
																+ " first.",
														null,
														{
															title : "Unsaved Changes!"
														})
									} else {
										l.grid.saveRequestProperties.params._cc = ""
									}
								}
								l.grid.saveRequestProperties.params._c = r._c;
								l.grid.startEditing(l._eventRowNum,
										l._eventColNum)
							} else {
								if (l.grid.saveRequestProperties
										&& l.grid.saveRequestProperties.params) {
									delete l.grid.saveRequestProperties.params._c
								}
								l.grid.startEditing(l._eventRowNum,
										l._eventColNum)
							}
						}
					}
				};
				var b = {
					title : "Pick",
					icon : "../images/icons/select.png",
					enableIf : function(s, t, r) {
						return !l._disabled
					},
					click : function() {
						l.pick(l._lookup)
					}
				};
				l._newButton = BizUtil.createImageButton(i.icon, true,
						"<b>New</b> record.", i.click);
				l._zoomButton = BizUtil.createImageButton(l._zoomItem.icon,
						true, "<b>Zoom</b> into record.", l._zoomItem.click);
				l._zoomButton.setDisabled(true);
				l._editButton = BizUtil.createImageButton(h.icon, true,
						"<b>Edit</b> a record inline.", h.click);
				l._editButton.setDisabled(true);
				l._pickButton = BizUtil.createImageButton(b.icon, true,
						"<b>Pick</b> this record.", b.click);
				l._pickButton.setDisabled(true);
				var q = {
					title : "Clear Filter",
					icon : "../images/icons/filter_delete.png",
					click : function() {
						l.grid.setFilterEditorCriteria({});
						l._advancedFilter.clearCriteria();
						l.refresh()
					}
				};
				var m = {
					title : "Refresh",
					icon : "../images/icons/refresh.png",
					click : function() {
						l.refresh()
					}
				};
				var o = {
					title : "Export Data...",
					icon : "../images/icons/export.png",
					click : function() {
						var B = l._dataSource.getFieldNames(true);
						var y = [ {
							name : "bizFlagComment",
							title : "Flag",
							line : 1,
							width : 100
						} ];
						var u = [];
						var t = l.getFieldState();
						for (var v = 0, s = B.length; v < s; v++) {
							var z = B[v];
							if ((z != "bizTagged") && (z != "bizFlagComment")) {
								var x = l._dataSource.getField(z);
								var A = l.grid.getField(z);
								var w = A ? A.align : "center";
								if (t[v]
										&& ((t[v].visible === undefined)
												|| (t[v].visible == null) || (t[v].visible))) {
									u.add({
										name : z,
										title : x.title,
										line : 1,
										width : t[v].width,
										align : w
									})
								} else {
									y.add({
										name : z,
										title : x.title,
										line : 1,
										width : 100,
										align : w
									})
								}
							}
						}
						var r = f();
						ReportDialog.popupExport(l._dataSource.ID,
								l._view ? l._view.gather(false)._c : null, r,
								y, u)
					}
				};
				var a = (d && d.isPickList) ? [ b ] : [];
				if (l.showAdd) {
					a.add(i)
				}
				if (l.showZoom) {
					a.add(l._zoomItem)
				}
				if (l.showEdit) {
					a.add(h)
				}
				if (l.showRemove) {
					a.add(this.deleteSelectionItem)
				}
				if (a.length > 0) {
					a.add({
						isSeparator : true
					})
				}
				if (l.showDeselect) {
					a.add(this.clearSelectionItem)
				}
				if (l.showFilter) {
					a.add(q)
				}
				a.add(m);
				if (l.showExport) {
					a.addList([ {
						isSeparator : true
					}, o ])
				}
				l._contextMenu = isc.Menu.create({
					showShadow : true,
					shadowDepth : 10,
					data : a
				});
				l._advancedFilter = isc.AdvancedFilter.create({
					filterableComponent : l,
					filterableComponentConfig : d
				});
				l._advancedFilter.toggleButton.click = function() {
					l._advancedFilter.toggleButtonClick()
				};
				var k = isc.Menu.create({
					showShadow : true,
					shadowDepth : 10,
					canSelectParentItems : true,
					data : []
				});
				var n = isc.MenuButton.create({
					autoFit : true,
					padding : 3,
					title : "No Snapshot",
					menu : k,
					click : function() {
						var r = {
							a : "L",
							ID : n.ID,
							d : l._dataSource.ID
						};
						if (l.snapId) {
							r.i = l.snapId
						}
						RPCManager.sendRequest({
							showPrompt : false,
							evalResult : true,
							useSimpleHttp : true,
							httpMethod : "POST",
							params : r,
							actionURL : BizUtil.URL_PREFIX + "smartsnap",
							callback : function(u, t, s) {
								k.setData(t)
							}
						});
						this.Super("click", arguments)
					}
				});
				n.newSnap = function() {
					isc
							.askForValue(
									"Enter the new snapshot name",
									function(r) {
										if (r) {
											RPCManager
													.sendRequest({
														showPrompt : true,
														evalResult : true,
														useSimpleHttp : true,
														httpMethod : "POST",
														params : {
															a : "N",
															n : r,
															d : l._dataSource.ID,
															s : {
																criteria : l._advancedFilter.toggleButton.selected ? l._advancedFilter
																		.getCriteria()
																		: l.grid
																				.getFilterEditorCriteria(),
																advancedCriteriaStyle : l._advancedFilter
																		.getStyle(),
																fieldState : l.grid
																		.getFieldState(),
																sortState : l.grid
																		.getSortState(),
																groupState : l.grid
																		.getGroupState(),
																summaryType : l.summaryType
															}
														},
														actionURL : BizUtil.URL_PREFIX
																+ "smartsnap",
														callback : function(u,
																t, s) {
															l.snapId = t.bizId;
															n.setTitle(r)
														}
													})
										}
									}, {
										width : 300
									})
				};
				n.setSnap = function(s, t, r) {
					l.snapId = s;
					n.setTitle(t);
					if (r) {
						if (r.criteria) {
							if (r.criteria.operator) {
								l._advancedFilter.toggleButton.select();
								l._advancedFilter.toggleButtonClick();
								l._advancedFilter
										.setStyle(r.advancedCriteriaStyle);
								l.grid.setFilterEditorCriteria({});
								l._advancedFilter.setCriteria(r.criteria)
							} else {
								l._advancedFilter.toggleButton.deselect();
								l._advancedFilter.toggleButtonClick();
								l.grid.setFilterEditorCriteria(r.criteria);
								l._advancedFilter.clearCriteria()
							}
						}
						if (r.fieldState) {
							l.grid.setFieldState(r.fieldState)
						}
						if (r.sortState) {
							l.grid.setSortState(r.sortState)
						}
						if (r.groupState) {
							l.grid.setGroupState(r.groupState)
						}
						if (r.summaryType) {
							l.summaryType = r.summaryType;
							l._summaryGrid.data[0].bizFlagComment = r.summaryType
						}
					}
					l.refresh()
				};
				n.updateSnap = function(r) {
					RPCManager
							.sendRequest({
								showPrompt : true,
								evalResult : true,
								useSimpleHttp : true,
								httpMethod : "POST",
								params : {
									a : "U",
									i : r,
									s : {
										criteria : l._advancedFilter.toggleButton.selected ? l._advancedFilter
												.getCriteria()
												: l.grid
														.getFilterEditorCriteria(),
										advancedCriteriaStyle : l._advancedFilter
												.getStyle(),
										fieldState : l.grid.getFieldState(),
										sortState : l.grid.getSortState(),
										groupState : l.grid.getGroupState(),
										summaryType : l.summaryType
									}
								},
								actionURL : BizUtil.URL_PREFIX + "smartsnap"
							})
				};
				n.deleteSnap = function(r) {
					isc
							.ask(
									"Do you want to delete this snapshot?",
									function(s) {
										if (s) {
											RPCManager
													.sendRequest({
														showPrompt : true,
														evalResult : true,
														useSimpleHttp : true,
														httpMethod : "POST",
														params : {
															a : "D",
															i : r
														},
														actionURL : BizUtil.URL_PREFIX
																+ "smartsnap",
														callback : function(v,
																u, t) {
															n
																	.setSnap(
																			null,
																			"No Snapshot",
																			null)
														}
													})
										}
									})
				};
				l._clearSnap = function() {
					l.snapId = null;
					n.setTitle("No Snapshot")
				};
				var p = isc.Menu.create({
					showShadow : true,
					shadowDepth : 10,
					canSelectParentItems : true,
					data : []
				});
				var c = isc.MenuButton.create({
					autoFit : true,
					padding : 3,
					title : "No Tag",
					menu : p,
					click : function() {
						var r = {
							a : "L",
							ID : c.ID
						};
						if (l.tagId) {
							r.t = l.tagId
						}
						RPCManager.sendRequest({
							showPrompt : false,
							evalResult : true,
							useSimpleHttp : true,
							httpMethod : "POST",
							params : r,
							actionURL : BizUtil.URL_PREFIX + "smarttag",
							callback : function(u, t, s) {
								p.setData(t)
							}
						});
						this.Super("click", arguments)
					}
				});
				c.newTag = function() {
					isc.askForValue("Enter the new tag name", function(r) {
						if (r) {
							RPCManager.sendRequest({
								showPrompt : true,
								evalResult : true,
								useSimpleHttp : true,
								httpMethod : "POST",
								params : {
									a : "N",
									n : r,
									ID : c.ID
								},
								actionURL : BizUtil.URL_PREFIX + "smarttag",
								callback : function(u, t, s) {
									l.tagId = t.bizId;
									c.setTitle(r);
									l.refresh()
								}
							})
						}
					}, {
						width : 300
					})
				};
				c.setTag = function(r, s) {
					l.tagId = r;
					c.setTitle(s);
					l.refresh()
				};
				c.tagOp = function(r, t) {
					if (t == "C") {
						isc
								.ask(
										"Do you want to clear all tagged data from this tag?",
										function(u) {
											if (u) {
												g(r, t)
											}
										})
					} else {
						if (t == "D") {
							isc.ask("Do you want to delete this tag?",
									function(u) {
										if (u) {
											g(r, t)
										}
									})
						} else {
							if ((t == "T") || (t == "U")) {
								var s = l.grid.getTotalRows();
								if (s > 10000) {
									isc
											.ask(
													"There are "
															+ s
															+ " rows in this list to "
															+ ((t == "U") ? "un"
																	: "")
															+ "tag which could take more than 1 minute!  Do you want to continue?",
													function(u) {
														if (u) {
															g(r, t)
														}
													})
								} else {
									if (s > 1000) {
										isc
												.ask(
														"There are "
																+ s
																+ " rows to "
																+ ((t == "U") ? "un"
																		: "")
																+ "tag which may take a few seconds.  Do you want to continue?",
														function(u) {
															if (u) {
																g(r, t)
															}
														})
									} else {
										g(r, t)
									}
								}
							} else {
								g(r, t)
							}
						}
					}
				};
				var g = function(r, s) {
					var t = {
						a : s,
						t : r
					};
					if (s == "T" || s == "U") {
						t.d = l._dataSource.ID;
						var u = f();
						t.c = u;
						if (l._view) {
							t._c = l._view.gather(false)._c
						}
					}
					RPCManager.sendRequest({
						showPrompt : true,
						evalResult : true,
						useSimpleHttp : true,
						httpMethod : "POST",
						params : t,
						actionURL : BizUtil.URL_PREFIX + "smarttag",
						callback : function(x, w, v) {
							if (s == "D") {
								c.setTag(null, "No Tag")
							}
							l.refresh()
						}
					})
				};
				var j = (d && d.isPickList) ? [ l._pickButton ] : [];
				if (l.showAdd) {
					j.add(l._newButton)
				}
				if (l.showZoom) {
					j.add(l._zoomButton)
				}
				if (l.showEdit) {
					j.add(l._editButton)
				}
				if (l.showRemove) {
					j.add(l.deleteSelectionButton)
				}
				if (j.length > 0) {
					j.add("separator")
				}
				if (l.showDeselect) {
					j.add(BizUtil.createImageButton(l.clearSelectionItem.icon,
							false, "<b>Deselect</b> all.",
							l.clearSelectionItem.click))
				}
				if (l.showFilter) {
					j.add(BizUtil.createImageButton(q.icon, false,
							"<b>Clear filter</b> criteria.", q.click))
				}
				j.add(BizUtil.createImageButton(m.icon, false,
						"<b>Refresh</b> table data.", m.click));
				if (l.showFilter) {
					j.addList([ "separator", l._advancedFilter.toggleButton ])
				}
				if (l.showExport) {
					j.addList([
							"separator",
							BizUtil.createImageButton(o.icon, false,
									"<b>Export</b> table data.", o.click) ])
				}
				if (l.showSnap) {
					j.addList([ "separator", isc.Label.create({
						width : 60,
						contents : "Snapshot:"
					}), n ])
				}
				if (l.showTag) {
					j.addList([ "separator", isc.Label.create({
						width : 30,
						contents : "Tag:"
					}), c ])
				}
				l._toolbar = isc.ToolStrip.create({
					membersMargin : 2,
					layoutMargin : 2,
					width : "100%",
					overflow : "hidden",
					members : j
				});
				l._summaryGrid = isc.ListGrid.create({
					editByCell : true,
					canEditCell : function(s, r) {
						return (r == 0)
					},
					rowClick : function() {
						this.selectRecord(0, false);
						return false
					},
					rowDoubleClick : function() {
						this.selectRecord(0, false);
						return false
					},
					rowContextClick : function() {
						this.selectRecord(0, false);
						return false
					},
					height : 20,
					leaveScrollbarGap : true,
					autoFetchData : false,
					autoFitData : null,
					showHeader : false,
					showEmptyMessage : false,
					bodyOverflow : "hidden"
				});
				if (l.title) {
					l.addMember(isc.HTMLFlow.create({
						contents : '<div class="dataGridTitle">' + l.title
								+ "</div>"
					}))
				}
				l.addMember(l._toolbar);
				l.addMember(l._advancedFilter);
				l.addMember(l.grid);
				if (l._config.isTree) {
				} else {
					if (l.showSummary) {
						l.addMember(l._summaryGrid)
					}
				}
				l._flagForm = l._flagDialog.items[0];
				if (d && d.name) {
					var e = l._view._grids[d.name];
					if (e) {
					} else {
						e = {};
						l._view._grids[d.name] = e
					}
					e[l.getID()] = l
				}
			},
			hasDataSource : function() {
				return (this.grid != null)
			},
			_createGrid : function(b, a) {
				var c = this;
				var d = {
					autoDraw : true,
					height : "*",
					leaveScrollbarGap : true,
					autoFetchData : false,
					useAllDataSourceFields : true,
					showHeader : true,
					headerHeight : 30,
					showFilterEditor : (c.showFilter && (!c._advancedFilter.toggleButton.selected)),
					selectionType : "single",
					alternateRecordStyles : true,
					canEdit : true,
					dataSource : c._dataSource,
					fields : a,
					editEvent : "none",
					neverValidate : false,
					validateByCell : true,
					saveByCell : false,
					validateOnChange : false,
					canHover : true,
					canReorderFields : false,
					autoSaveEdits : true,
					modalEditing : true,
					canFreezeFields : false,
					contextMenu : c._contextMenu,
					showRollOver : true,
					canExpandRecords : false,
					expansionMode : "details",
					rowClick : function(e, g, f) {
						if (e && e.bizId) {
							c._eventRecord = e;
							c._eventRowNum = g;
							c._eventColNum = f;
							this.selectSingleRecord(e)
						}
						return this.Super("rowClick", arguments)
					},
					rowContextClick : function(e, g, f) {
						if (e && e.bizId) {
							this.deselectAllRecords();
							c._eventRecord = e;
							c._eventRowNum = g;
							c._eventColNum = f;
							this.selectSingleRecord(e);
							return true
						}
						return false
					},
					rowDoubleClick : function(e, g, f) {
						if (e && e.bizId) {
							c._eventRecord = e;
							c._eventRowNum = g;
							c._eventColNum = f;
							if (b && b.isPickList) {
								c.pick(c._lookup)
							} else {
								if (c.showZoom && c.canZoom) {
									c._zoomItem.click()
								}
							}
						}
						return true
					},
					selectionChanged : function(e, f) {
						if (this.anySelected()) {
							c._zoomButton.setDisabled(!c.canZoom);
							c._editButton.setDisabled(c._disabled
									|| (!c.canUpdate) || (!c.canEdit));
							c._pickButton.setDisabled(c._disabled);
							c.deleteSelectionButton.setDisabled(c._disabled
									|| (!c.canDelete) || (!c.canRemove))
						} else {
							c._zoomButton.setDisabled(true);
							c._editButton.setDisabled(true);
							c._pickButton.setDisabled(true);
							c.deleteSelectionButton.setDisabled(true)
						}
						c._newButton.setDisabled(c._disabled || (!c.canCreate)
								|| (!c.canAdd))
					},
					selectionUpdated : function(f, e) {
						if (c.bizSelected) {
							c.bizSelected(f ? f.bizId : null)
						}
					},
					editComplete : function(j, f, g, e, i, h) {
						if (c.bizEdited) {
							c.bizEdited()
						}
					},
					filterData : function(h, g, f) {
						var e = h;
						if (f) {
							if (f.params) {
							} else {
								f.params = {}
							}
						} else {
							f = {};
							f.params = {}
						}
						if (b.isTree) {
						} else {
							f.params._summary = c.summaryType
						}
						if (c.showTag) {
							f.params._tagId = c.tagId
						}
						if (c._view) {
							f.params._c = c._view.gather(false)._c
						}
						if (b && b.contConv) {
							f.params._cc = ""
						}
						if (b && b.params) {
							e = BizUtil.completeFilterCriteria(e, b.params,
									c._view)
						}
						this.Super("filterData", [ e, g, f ]);
						if (h) {
							if (h.operator) {
							} else {
								this.setFilterEditorCriteria(h)
							}
						} else {
							this.setFilterEditorCriteria({})
						}
					},
					dataProperties : {
						transformData : function(q, o) {
							if (o.context
									&& (o.context.operationType == "fetch")
									&& (o.status == isc.RPCResponse.STATUS_SUCCESS)) {
								var k = [ {
									name : "bizFlagComment",
									type : "enum",
									valueMap : [ "", "Count", "Avg", "Sum",
											"Min", "Max" ],
									width : 70,
									change : function(r, l, s, i) {
										c.summaryType = s;
										c.grid.invalidateCache();
										c.grid
												.filterData(c._advancedFilter.toggleButton.selected ? c._advancedFilter
														.getCriteria()
														: c.grid
																.getFilterEditorCriteria())
									}
								} ];
								var p = c._dataSource.getFieldNames(true);
								k.setLength(p.length - 1);
								for (var h = 0, f = p.length; h < f; h++) {
									var n = p[h];
									if ((n != "bizTagged")
											&& (n != "bizFlagComment")) {
										var m = c._dataSource.getField(n);
										var j = "float";
										var e = null;
										if ((c.summaryType == "Min")
												|| (c.summaryType == "Max")) {
											j = m.type;
											if ((j != "comboBox")
													&& (j != "enum")
													&& (j != "select")
													&& (j != "bizLookupDescription")
													&& (j != "boolean")) {
												e = m.editorType
											}
										}
										k[h - 1] = {
											name : n,
											type : j,
											editorType : e,
											canEdit : false
										};
										if (j == "float") {
											k[h - 1].formatCellValue = function(
													s, i, t, l, r) {
												if (isc.isA.Boolean(s)) {
													return null
												}
												return s
											}
										}
									}
								}
								c._summaryGrid.setFields(k);
								var g = q.pop();
								c._summaryGrid.setData([ g ]);
								c.grid.fieldStateChanged();
								c._summaryGrid.startEditing(0, 0, true);
								c._summaryGrid.selectRecord(0, false)
							}
							return q
						}
					},
					canEditCell : function(f, e) {
						return (!c._disabled) && (e > (c.showTag ? 1 : 0))
								&& this.Super("canEditCell", arguments)
					},
					fieldStateChanged : function() {
						var e = c.getFieldState();
						if (c.showTag) {
							e[1].width = e[0].width + e[1].width
						}
						e.removeAt(0);
						if (this.canExpandRecords) {
							e[0].width += 30
						}
						c._summaryGrid.setFieldState(e)
					},
					scrolled : function() {
						if (c._summaryGrid.body) {
							c._summaryGrid.body.scrollTo(c.grid.body
									.getScrollLeft(), 0)
						}
					},
					getCellCSSText : function(e, g, f) {
						if (e) {
							if (e.bizTagged) {
								return "font-weight:bold;background-color:#B8D1EA;"
							}
						}
					}
				};
				if (b.isTree) {
					d.folderIcon = null;
					d.loadOnDemand = true;
					d.dataProperties = {
						openProperty : "_isOpen",
						isFolderProperty : "_isFolder",
						childrenProperty : "_children"
					};
					d.dataFetchMode = "paged";
					c.grid = isc.TreeGrid.create(d)
				} else {
					c.grid = isc.ListGrid.create(d)
				}
			},
			setDisabled : function(a) {
				this._disabled = a;
				if (this.grid) {
					this.grid.selectionChanged()
				}
			},
			setLookup : function(c, b, a) {
				this._lookup = c;
				this._config.params = b;
				this._view = a
			},
			refresh : function() {
				this.grid.deselectAllRecords();
				this._eventRowNum = null;
				this._eventColumnNum = null;
				this._eventRecord = null;
				this.grid.invalidateCache();
				this.grid
						.filterData(this._advancedFilter.toggleButton.selected ? this._advancedFilter
								.getCriteria()
								: this.grid.getFilterEditorCriteria())
			},
			rerender : function() {
				if (this.isPickList) {
					this.refresh()
				}
			},
			setDataSource : function(d) {
				var e = this;
				e._clearSnap();
				e._dataSource = DataSource.get(d);
				e.canCreate = e._dataSource.canCreate;
				e.canUpdate = e._dataSource.canUpdate;
				e.canDelete = e._dataSource.canDelete;
				var c = [];
				if (e.showTag) {
					c
							.add({
								name : "bizTagged",
								width : 30,
								align : "center",
								canHide : false,
								canSort : false,
								canToggle : true,
								canGroupBy : false,
								showHover : false,
								recordClick : function(r, m, q, p, i, o, n) {
									if (m) {
										if (e.canUpdate && e.canEdit) {
											if (e.tagId) {
												e._eventRecord = m;
												e._eventRowNum = q;
												e._eventColNum = i;
												if (m.bizTagged) {
													m.bizTagged = "UNTAG"
												} else {
													m.bizTagged = "TAG"
												}
												e.grid.updateData(m, "", {
													showPrompt : false,
													params : {
														_tagId : e.tagId
													}
												})
											} else {
												isc
														.warn("Select or create a tag first from the tags menu in the list toolbar")
											}
										}
									}
									return false
								}
							})
				} else {
					c.add({
						name : "bizTagged",
						hidden : true,
						canHide : false
					})
				}
				c.add({
					name : "bizFlagComment",
					width : ((!e.showTag) && e.showSummary) ? 60 : 40,
					align : "center",
					canHide : false,
					formatCellValue : function(i) {
						if (i) {
							return '<img src="images/flag.gif">'
						} else {
							return ""
						}
					},
					recordClick : function(r, m, q, p, i, o, n) {
						if (e.canUpdate && e.canEdit) {
							e._eventRecord = m;
							e._eventRowNum = q;
							e._eventColNum = i;
							e._flagForm.editRecord(m);
							e._flagDialog.show()
						}
						return false
					},
					hoverHTML : function(i, o, p, m, n) {
						return i.bizFlagComment
					}
				});
				var l = e._dataSource.getFieldNames(true);
				var f = false;
				var h = true;
				for (var b = 0; b < l.length; b++) {
					var j = l[b];
					if ((j != "bizTagged") && (j != "bizFlagComment")) {
						var k = e._dataSource.getField(j);
						if (k.foreignKey) {
						} else {
							var a = {
								name : j,
								autoFitWidth : false,
								canToggle : false
							};
							if (h) {
								a.treeField = true;
								h = false
							}
							if (k.canSave == false) {
								a.canEdit = false
							}
							f = (f || k.detail);
							c.add(a)
						}
					}
				}
				e._advancedFilter.setDataSource(e._dataSource);
				e._flagForm.setDataSource(e._dataSource);
				e._flagForm.setFields([ {
					name : "bizFlagComment",
					type : "richText",
					height : 175,
					validators : [ {
						type : "lengthRange",
						min : 0,
						max : 1024,
						clientOnly : true
					} ]
				} ]);
				if (e.grid) {
					e.removeMember(e.grid);
					e.grid.destroy()
				}
				e._createGrid(e._config, c);
				e.grid.setCanExpandRecords(f);
				if (e._config.isTree || (!e.showSummary)) {
					e.addMember(e.grid)
				} else {
					e.addMember(e.grid, e.getMembers().length - 1)
				}
				if (e.rootIdBinding) {
					e.grid.getDataSource().getField("bizParentId").rootValue = "_"
							+ e._view._vm.getValue(e.rootIdBinding)
				} else {
					var g = e.grid.getDataSource().getField("bizParentId");
					if (g) {
						g.rootValue = null
					}
				}
				e.grid.filterData();
				e.grid.selectionChanged(null, false);
				return e._dataSource.getTitle()
			},
			getFieldState : function() {
				var fieldState = eval(this.grid.getFieldState());
				for (var i = 0, l = fieldState.length; i < l; i++) {
					if (fieldState[i].width) {
						continue
					} else {
						fieldState[i].width = this.grid
								.getFieldWidth(fieldState[i].name)
					}
				}
				if (this.grid.filterEditor) {
					this.grid.filterEditor.setFieldState(fieldState)
				}
				return fieldState
			},
			zoom : function(h, d, e) {
				var f = this;
				var c = null;
				var g = null;
				var i = null;
				if ((!h) && f._eventRecord) {
					c = f._eventRecord.bizModule;
					g = f._eventRecord.bizDocument;
					i = f._eventRecord.bizId
				} else {
					var b = this.grid.dataSource.modoc.indexOf(".");
					c = this.grid.dataSource.modoc.substring(0, b);
					g = this.grid.dataSource.modoc.substring(b + 1)
				}
				var a = f.grid.body.getPageRect();
				BizUtil.getEditView(c, g, function(k) {
					if (f._view) {
						var j = f._view.gather(false);
						if (d) {
							f._zoom(h, k, e, i, j._c, a)
						} else {
							if (j._apply || f._view._vm.valuesHaveChanged()) {
								delete j._apply;
								f._view.saveInstance(null, function() {
									f._zoom(h, k, e, i, null, a)
								})
							} else {
								f._zoom(h, k, e, i, null, a)
							}
						}
					} else {
						f._zoom(h, k, e, i, null, a)
					}
				})
			},
			_zoom : function(a, b, g, f, c, d) {
				if (a) {
					WindowStack.popup(d, "New", true, [ b ]);
					b.newInstance(g, null, c)
				} else {
					var e = [ d[0],
							this.grid.body.getRowPageTop(this._eventRowNum),
							d[2], this.grid.body.getRowSize(this._eventRowNum) ];
					WindowStack.popup(e, "Edit", true, [ b ]);
					b.editInstance(f, null, c)
				}
			},
			pick : function(a) {
				if (this._eventRecord) {
					a.setValueMapFromPickList(this._eventRecord);
					a.setValue(this._eventRecord.bizId);
					a.bizPicked(a.form, a, this._eventRecord.bizId)
				}
				WindowStack.popoff(false);
				if (this._eventRecord) {
					if (a.changedForServer) {
						a.changedForServer(a.form, a, this._eventRecord.bizId)
					}
					this._eventRecord = null
				}
			}
		});
isc.ClassFactory.defineClass("BizDataGrid", "BizGrid");
BizDataGrid.addProperties({
	_newButton : null,
	_zoomButton : null,
	_editButton : null,
	showAdd : true,
	showZoom : true,
	showEdit : true,
	showRemove : true,
	showDeselect : true,
	_mod : null,
	_doc : null,
	_b : null,
	_ordinal : null
});
BizDataGrid
		.addMethods({
			initWidget : function(b) {
				this.Super("initWidget", arguments);
				var i = this;
				var g = {
					title : "New",
					icon : "../images/icons/new.png",
					enableIf : function(k, l, j) {
						return ((!i._disabled) && i.canCreate && i.canAdd)
					},
					click : function() {
						if (b.inline) {
							i.add()
						} else {
							i.zoom(true)
						}
					}
				};
				var c = {
					title : "Zoom",
					icon : "../images/icons/zoom.gif",
					click : function() {
						i.zoom(false)
					},
					enableIf : function(k, l, j) {
						return (i.canZoom && i.grid.anySelected())
					}
				};
				var f = {
					title : "Edit",
					icon : "../images/icons/edit.png",
					enableIf : function(k, l, j) {
						return ((!i._disabled) && i.canUpdate && i.canEdit && i.grid
								.anySelected())
					},
					click : function() {
						if (i.grid.anySelected()) {
							i.grid.startEditing(i._eventRowNum, i._eventColNum)
						}
					}
				};
				i._newButton = BizUtil.createImageButton(g.icon, true,
						"<b>New</b> record.", g.click);
				i._zoomButton = BizUtil.createImageButton(c.icon, true,
						"<b>Zoom</b> into record.", c.click);
				i._zoomButton.setDisabled(true);
				i._editButton = BizUtil.createImageButton(f.icon, true,
						"<b>Edit</b> a record inline.", f.click);
				i._editButton.setDisabled(true);
				var a = [];
				if (b.editable) {
					if (i.showAdd) {
						a.add(g)
					}
					if (i.showZoom) {
						a.add(c)
					}
					if (i.showEdit) {
						a.add(f)
					}
					if (i.showRemove) {
						a.add(this.deleteSelectionItem)
					}
					if (i.showDeselect) {
						if (a.length > 0) {
							a.add({
								isSeparator : true
							})
						}
						a.add(this.clearSelectionItem)
					}
				}
				var e = isc.Menu.create({
					showShadow : true,
					shadowDepth : 10,
					data : a
				});
				i.grid = isc.ListGrid
						.create({
							height : "*",
							autoFetchData : false,
							headerHeight : 30,
							showFilterEditor : false,
							fields : i._fields,
							selectionType : "single",
							alternateRecordStyles : true,
							canEdit : i.canUpdate && i.canEdit,
							editEvent : "none",
							neverValidate : false,
							validateByCell : true,
							saveByCell : false,
							validateOnChange : false,
							canHover : true,
							wrapCells : i.wordWrap ? true : false,
							fixedRecordHeights : i.wordWrap ? false : true,
							canReorderFields : false,
							canReorderRecords : (b._ordinal ? ((b.canUpdate && i.canEdit) ? true
									: false)
									: false),
							recordsDropped : function(m, k, l, j) {
								this.reorderData()
							},
							reorderData : function() {
								if (b._ordinal) {
									var m = this.getData();
									for (var k = 0, j = m.length; k < j; k++) {
										m[k][b._ordinal] = k + 1
									}
								}
							},
							dragDataAction : "move",
							autoSaveEdits : true,
							modalEditing : true,
							canFreezeFields : false,
							contextMenu : e,
							showRollOver : true,
							rowClick : function(j, l, k) {
								if (j && j.bizId) {
									i._eventRecord = j;
									i._eventRowNum = l;
									i._eventColNum = k
								}
								return this.Super("rowClick", arguments)
							},
							rowContextClick : function(j, l, k) {
								if (j && j.bizId) {
									this.deselectAllRecords();
									i._eventRecord = j;
									i._eventRowNum = l;
									i._eventColNum = k;
									this.selectSingleRecord(j);
									return true
								}
								return false
							},
							rowDoubleClick : function(j, l, k) {
								if (b.editable) {
									if (j.isFolder) {
									} else {
										i._eventRecord = j;
										i._eventRowNum = l;
										i._eventColNum = k;
										this.selectSingleRecord(j);
										if (b.inline) {
											if (i.canUpdate && i.canEdit
													&& i.showEdit
													&& (!i._disabled)) {
												this.startEditing(l, k, false)
											}
										} else {
											if (i.canZoom && i.showZoom) {
												i.zoom(false)
											}
										}
									}
								}
								return this.Super("rowDoubleClick", arguments)
							},
							selectionChanged : function(j, k) {
								if (this.anySelected()) {
									i._zoomButton.setDisabled(!i.canZoom);
									i._editButton.setDisabled(i._disabled
											|| (!i.canUpdate) || (!i.canEdit));
									i.deleteSelectionButton
											.setDisabled(i._disabled
													|| (!i.canDelete)
													|| (!i.canRemove))
								} else {
									i._zoomButton.setDisabled(true);
									i._editButton.setDisabled(true);
									i.deleteSelectionButton.setDisabled(true)
								}
								i._newButton.setDisabled(i._disabled
										|| (!i.canCreate) || (!i.canAdd))
							},
							selectionUpdated : function(k, j) {
								if (i.bizSelected) {
									i.bizSelected(k ? k.bizId : null)
								}
							},
							canEditCell : function(k, j) {
								return (!i._disabled)
										&& this.Super("canEditCell", arguments)
							},
							editComplete : function(n, k, l, j, m) {
								i._view._vm.setValue("_changed", true);
								i._view._vm.setValue("_apply", true);
								if (i.bizEdited) {
									i.bizEdited()
								}
							}
						});
				var d = i._view._grids[i._b];
				if (d) {
				} else {
					d = {};
					i._view._grids[i._b] = d
				}
				d[i.getID()] = i;
				if (i.title) {
					i.addMember(isc.HTMLFlow.create({
						contents : '<div class="dataGridTitle">' + i.title
								+ "</div>"
					}))
				}
				if (b.editable) {
					var h = [];
					if (i.showAdd) {
						h.add(i._newButton)
					}
					if (i.showZoom) {
						h.add(i._zoomButton)
					}
					if (i.showEdit) {
						h.add(i._editButton)
					}
					if (i.showRemove) {
						h.add(i.deleteSelectionButton)
					}
					if (i.showDeselect) {
						if (h.length > 0) {
							h.add("separator")
						}
						h.add(BizUtil.createImageButton(
								i.clearSelectionItem.icon, false,
								"<b>Deselect</b> all.",
								i.clearSelectionItem.click))
					}
					if (h.length > 0) {
						i.addMember(isc.ToolStrip.create({
							membersMargin : 2,
							layoutMargin : 2,
							width : "100%",
							members : h
						}))
					}
				}
				i.addMember(i.grid)
			},
			setDisabled : function(a) {
				this._disabled = a;
				if (this.grid) {
					this.grid.selectionChanged()
				}
			},
			zoom : function(a) {
				var c = this;
				var b = (this._eventRecord ? this._eventRecord.bizModule
						: this._mod);
				var d = (this._eventRecord ? this._eventRecord.bizDocument
						: this._doc);
				BizUtil
						.getEditView(
								b,
								d,
								function(f) {
									var k = ((c._view._b) ? c._view._b + "."
											+ c._b : c._b);
									var i = (a ? null : c._eventRecord.bizId);
									var e = c._view.gather(true);
									if (e) {
										var h = c.grid.body.getPageRect();
										var g = c.grid.body
												.getRowPageTop(c._eventRowNum);
										var j = c.grid.body
												.getRowSize(c._eventRowNum);
										if (e._apply
												|| c._view._vm
														.valuesHaveChanged()) {
											delete e._apply;
											c._view.saveInstance(null,
													function() {
														c._zoom(a, i, k, f,
																e._c, h, g, j)
													})
										} else {
											c._zoom(a, i, k, f, e._c, h, g, j)
										}
									} else {
										isc
												.warn("You cannot zoom in until you fix the problems found")
									}
								})
			},
			_zoom : function(h, d, i, g, f, b, c, a) {
				if (h) {
					WindowStack.popup(b, "New", false, [ g ])
				} else {
					var e = [ b[0], c, b[2], a ];
					WindowStack.popup(e, "Edit", false, [ g ])
				}
				g.editInstance(d, i, f, true)
			},
			add : function() {
				this.grid.startEditingNew({
					bizId : null
				})
			},
			remove : function(a) {
				var b = this.grid.data;
				b.removeAt(b.findIndex("bizId", a));
				this.grid.deselectAllRecords();
				this._eventRowNum = null;
				this._eventColumnNum = null;
				this._eventRecord = null
			}
		});
isc.defineClass("ListView");
ListView.addClassProperties({
	_heading : isc.HTMLFlow.create({
		showEdges : true
	}),
	contents : isc.VLayout.create({
		width : "100%",
		height : "100%",
		overflow : "auto",
		membersMargin : 2,
		layoutMargin : 2,
		margin : 2,
		rerender : function() {
			if (ListView._grid && ListView._grid.isVisible()) {
				ListView._grid.refresh()
			} else {
				if (ListView._calendar && ListView._calendar.isVisible()) {
					ListView._calendar.refresh()
				} else {
					if (ListView._tree && ListView._tree.isVisible()) {
						ListView._tree.refresh()
					} else {
						if (ListView._map && ListView._map.isVisible()) {
							ListView._map.rerender()
						}
					}
				}
			}
		},
		resume : function() {
			if (ListView._grid && ListView._grid.isVisible()) {
			} else {
				if (ListView._calendar && ListView._calendar.isVisible()) {
				} else {
					if (ListView._tree && ListView._tree.isVisible()) {
					} else {
						if (ListView._map && ListView._map.isVisible()) {
							ListView._map.resume()
						}
					}
				}
			}
		}
	}),
	_grid : null,
	_calendar : null,
	_tree : null,
	_map : null,
	_portal : isc.PortalLayout
			.create({
				width : "100%",
				height : "100%",
				getDropPortlet : function(g, c, h, e) {
					if (g.isA("TreeGrid") && g.getID().endsWith("Tree")) {
						var f = g.getDragData()[0];
						var i = isc.Portlet.create({
							title : f.desc,
							items : []
						});
						if (f.ref == "edit") {
							BizUtil.getEditView(g.data.root.name, f.name,
									function(k) {
										i.addItem(k);
										k.newInstance(null, null, null, null,
												function() {
													k.hideMember(k._heading)
												})
									})
						} else {
							if (f.ref == "grid") {
								var a = BizUtil.createListGrid();
								i.addItem(a);
								a
										.setDataSource(g.data.root.name + "_"
												+ f.name)
							} else {
								if (f.ref == "cal") {
									var d = BizUtil.createCalendar();
									i.addItem(d);
									d.setDataSource(g.data.root.name + "_"
											+ f.name)
								} else {
									if (f.ref == "tree") {
										var j = BizUtil.createTreeGrid();
										i.addItem(j);
										j.setDataSource(g.data.root.name + "_"
												+ f.name)
									} else {
										if (f.ref == "map") {
											var b = BizUtil.createMap();
											i.addItem(b);
											b.setDataSource(g.data.root.name
													+ "_" + f.name)
										} else {
											alert("Menu ref of " + f.ref
													+ "is unknown")
										}
									}
								}
							}
						}
						return i
					} else {
						return this.Super("getDropPortlet", arguments)
					}
				}
			}),
	_setHeading : function(b, a, d) {
		var c = BizUtil.headerTemplate;
		c = c.replace("{modoc}", d).replace("{icon}", a).replace("{title}", b)
				.replace("{link}", "");
		ListView._heading.setContents(c)
	},
	setGridDataSource : function(ID) {
		if (ListView._grid) {
		} else {
			ListView._grid = BizUtil.createListGrid();
			ListView.contents.addMember(ListView._grid)
		}
		if (ListView._calendar) {
			ListView.contents.hideMember(ListView._calendar)
		}
		if (ListView._tree) {
			ListView.contents.hideMember(ListView._tree)
		}
		if (ListView._map) {
			ListView.contents.hideMember(ListView._map)
		}
		ListView.contents.hideMember(ListView._portal);
		ListView.contents.showMember(ListView._grid);
		var ds = eval(ID);
		ListView._setHeading(ListView._grid.setDataSource(ds), ds.icon,
				ds.modoc)
	},
	setCalendarDataSource : function(ID) {
		if (ListView._calendar) {
		} else {
			ListView._calendar = BizUtil.createCalendar();
			ListView.contents.addMember(ListView._calendar)
		}
		if (ListView._grid) {
			ListView.contents.hideMember(ListView._grid)
		}
		if (ListView._tree) {
			ListView.contents.hideMember(ListView._tree)
		}
		if (ListView._map) {
			ListView.contents.hideMember(ListView._map)
		}
		ListView.contents.hideMember(ListView._portal);
		ListView.contents.showMember(ListView._calendar);
		var ds = eval(ID);
		ListView._calendar.setDataSource(ds);
		ListView._setHeading("NOT IMPLEMENTED", ds.icon, ds.modoc)
	},
	setTreeDataSource : function(ID) {
		if (ListView._tree) {
		} else {
			ListView._tree = BizUtil.createTreeGrid();
			ListView.contents.addMember(ListView._tree)
		}
		if (ListView._grid) {
			ListView.contents.hideMember(ListView._grid)
		}
		if (ListView._calendar) {
			ListView.contents.hideMember(ListView._calendar)
		}
		if (ListView._map) {
			ListView.contents.hideMember(ListView._map)
		}
		ListView.contents.hideMember(ListView._portal);
		ListView.contents.showMember(ListView._tree);
		var ds = eval(ID);
		ListView._setHeading(ListView._tree.setDataSource(ds), ds.icon,
				ds.modoc)
	},
	setMapDataSource : function(ID) {
		if (ListView._map) {
		} else {
			ListView._map = BizUtil.createMap();
			ListView.contents.addMember(ListView._map)
		}
		if (ListView._grid) {
			ListView.contents.hideMember(ListView._grid)
		}
		if (ListView._calendar) {
			ListView.contents.hideMember(ListView._calendar)
		}
		if (ListView._tree) {
			ListView.contents.hideMember(ListView._tree)
		}
		ListView.contents.hideMember(ListView._portal);
		ListView.contents.showMember(ListView._map);
		var ds = eval(ID);
		ListView._map.setDataSource(ds);
		ListView._setHeading("MAP", ds.icon, ds.modoc)
	},
	showPortal : function() {
		if (ListView._grid) {
			ListView.contents.hideMember(ListView._grid)
		}
		if (ListView._calendar) {
			ListView.contents.hideMember(ListView._calendar)
		}
		if (ListView._tree) {
			ListView.contents.hideMember(ListView._tree)
		}
		if (ListView._map) {
			ListView.contents.hideMember(ListView._map)
		}
		ListView.contents.showMember(ListView._portal);
		ListView._setHeading("DASHBOARD", "shared/icons/Home.png", "")
	}
});
ListView.contents.addMember(ListView._heading);
ListView.contents.addMember(ListView._portal);
ListView.contents.hideMember(ListView._portal);
isc.ClassFactory.defineClass("BizContainer", "VLayout");
BizContainer.addMethods({
	initWidget : function() {
		this.backgroundImage = "background.png";
		this.backgroundRepeat = "repeat";
		this.Super("initWidget", arguments);
		this.contained = []
	},
	addContained : function(a) {
		this.contained.add(a);
		this.addMember(a)
	}
});
isc.ClassFactory.defineClass("EditView", "BizContainer");
isc.EditView.addClassProperties({
	_DATA_SOURCE : isc.RestDataSource.create({
		dataFormat : "json",
		dataURL : "smartedit",
		sendExtraFields : false
	})
});
isc.EditView
		.addMethods({
			initWidget : function() {
				this.overflow = "hidden";
				this.membersMargin = 2;
				this.layoutMargin = 2;
				this.margin = 2;
				this._grids = {};
				this._refreshedGrids = {};
				this.Super("initWidget", arguments);
				this._heading = isc.HTMLFlow.create({
					showEdges : true
				});
				this.addMember(this._heading);
				this._actionPanel = isc.ToolStrip.create({
					layoutMargin : 2,
					membersMargin : 5,
					width : "100%"
				});
				this.addMember(this._actionPanel);
				this._editPanel = isc.BizContainer.create({
					layoutMargin : 2,
					membersMargin : 5,
					overflow : "auto"
				});
				this.addMember(this._editPanel);
				var a = this;
				this._vm = ValuesManager
						.create({
							dataSource : EditView._DATA_SOURCE,
							handleHiddenValidationErrors : function(o) {
								var e = [];
								for ( var h in o) {
									var q = o[h];
									var j = h.split("__");
									if (j.length == 2) {
										var p = j[0].lastIndexOf("_");
										if (p > -1) {
											var k = j[0].substring(0, p);
											var d = a._grids[k];
											if (d) {
												var n = parseInt(j[0]
														.substring(p + 1));
												if (isA.Number(n)) {
													for ( var g in d) {
														var b = d[g];
														if (b) {
															if (b.grid) {
																b.grid
																		.setFieldError(
																				n,
																				j[1],
																				q);
																b.grid
																		.markForRedraw()
															}
														}
													}
												}
											}
										}
									}
									if (!e.contains(q)) {
										e.add(q)
									}
								}
								if (e.length > 0) {
									var m = "<ul>";
									for (var f = 0, c = e.length; f < c; f++) {
										m += "<li>" + e[f] + "</li>"
									}
									m += "</ul>";
									isc.warn(m, null, {
										title : "Problems"
									})
								}
								return false
							},
							saveEditorValues : function(c, b, e, d) {
								d.oldValues = null;
								this.Super("saveEditorValues", arguments)
							}
						})
			},
			addContained : function(a) {
				this._editPanel.addContained(a)
			},
			addEditAction : function(a) {
				a.forCreate = false;
				this._actionPanel.addMember(a)
			},
			addCreateAction : function(a) {
				a.forCreate = true;
				this._actionPanel.addMember(a)
			},
			addAction : function(a) {
				a.forCreate = null;
				this._actionPanel.addMember(a)
			},
			toDisplay : function(expression, instance) {
				var tokens = expression.match(/\{[A-Za-z0-9._]+\}/g);
				if (tokens) {
					for (var i = 0; i < tokens.length; i++) {
						var token = tokens[i];
						var binding = token.substring(1, token.length - 1)
								.replaceAll(".", "_");
						var evaluation = eval("instance." + binding);
						if ("undefined" === typeof (evaluation)) {
							evaluation = ""
						} else {
							if ((evaluation == null) || (evaluation == "null")
									|| (evaluation == "undefined")) {
								evaluation = ""
							} else {
								if (evaluation.toDateStamp) {
									evaluation = evaluation.toDateStamp();
									evaluation = evaluation.substring(0, 4)
											+ "-" + evaluation.substring(4, 6)
											+ "-" + evaluation.substring(6, 11)
											+ ":"
											+ evaluation.substring(11, 13)
											+ ":"
											+ evaluation.substring(13, 15)
											+ ".000"
								} else {
									if (evaluation.toString) {
										evaluation = evaluation.toString()
									}
								}
							}
						}
						expression = expression.replace(token, evaluation)
					}
				}
				return expression
			},
			rerender : function() {
				var a = this.gather(false);
				if (a) {
					this._editInstance("ZoomOut", a.bizId, this._b, a._c,
							this._openedFromDataGrid)
				}
			},
			newInstance : function(d, a, e, h, b) {
				this._openedFromDataGrid = h;
				if (this._vm.members) {
					this.hide();
					this._b = a;
					var g = this;
					var c = {
						_mod : this._mod,
						_doc : this._doc,
						_ecnt : this._ecnt,
						_ccnt : this._ccnt
					};
					if (a) {
						c._b = a
					}
					if (e) {
						c._c = e
					}
					if (d) {
						for ( var f in d) {
							var i = d[f];
							c[f] = i
						}
					}
					this._vm.fetchData(null, function(l, m, k) {
						var j = {};
						if (l.status >= 0) {
							g._vm.setSaveOperationType("add");
							j = m[0];
							g.scatter(j);
							if (h) {
								g._b += "ElementById(" + i.bizId + ")"
							}
							if (b) {
								b(m)
							}
						} else {
							if (l.status == -1) {
								isc.warn(m, null, {
									title : "Problems"
								})
							}
						}
						g.show();
						g.refreshListGrids(true, true, j);
						if (g.opened) {
							g.opened(m)
						}
					}, {
						httpMethod : "POST",
						params : c,
						willHandleError : true
					})
				}
			},
			editInstance : function(c, e, b, d, a) {
				this._saved = false;
				this._editInstance(null, c, e, b, d, a)
			},
			_editInstance : function(e, d, h, b, g, a) {
				this._openedFromDataGrid = g;
				if (this._vm.members) {
					this.hide();
					this._b = h;
					var f = {
						bizId : d,
						_mod : this._mod,
						_doc : this._doc,
						_ecnt : this._ecnt,
						_ccnt : this._ccnt
					};
					if (e) {
						f._a = e
					}
					if (h) {
						f._b = h
					}
					if (b) {
						f._c = b
					}
					var c = this;
					this._vm.fetchData(null, function(k, l, j) {
						var i = {};
						if (k.status >= 0) {
							i = l[0];
							c.scatter(i);
							if (g) {
								if (c._b.endsWith(")")) {
								} else {
									c._b += "ElementById(" + i.bizId + ")"
								}
							}
							if (a) {
								a(l)
							}
						} else {
							if (k.status == -1) {
								isc.warn(l, null, {
									title : "Problems"
								})
							}
						}
						if (e == "ZoomOut") {
							c._vm.setValue("_apply", true)
						} else {
							if (d) {
							} else {
								c._vm.setValue("_apply", true)
							}
						}
						c.show();
						c.refreshListGrids(true, (!e), i);
						if (c.opened) {
							c.opened(l)
						}
					}, {
						httpMethod : "POST",
						params : f,
						willHandleError : true
					})
				}
			},
			saveInstance : function(e, b) {
				var a = this.gather(true);
				if (a) {
					var c = a._c;
					delete a._c;
					var f = {
						_mod : this._mod,
						_doc : this._doc,
						_ecnt : this._ecnt,
						_ccnt : this._ccnt,
						bean : a,
						bizId : a.bizId,
						_c : c
					};
					if (e) {
						f._a = e;
						if (e == "_PUSH") {
							e = null
						}
					}
					if (this._b) {
						f._b = this._b
					}
					var d = this;
					this._vm.saveData(function(p, i, l) {
						if (p.status >= 0) {
							var k = null;
							if (e == "ZoomOut") {
								var m = WindowStack.getOpener();
								var o = m.gather(false);
								o._c = i._c;
								var n = d._b;
								var j = n.lastIndexOf(".");
								if (j >= 0) {
									n = n.substring(j + 1)
								}
								if (n.endsWith(")")) {
									var j = n.lastIndexOf("ElementById");
									if (j >= 0) {
										n = n.substring(0, j)
									}
								}
								var h = m._b;
								if (h && h.endsWith(")")) {
									var j = h.lastIndexOf("ElementById");
									if (j >= 0) {
										h = h.substring(0, j)
									}
								}
								var g = o[n];
								if (isc.isAn.Array(g)) {
									WindowStack.popoff(true);
									return
								} else {
									o[n] = i.bizId;
									k = m._vm.getItem(n);
									if (k) {
										if (a.bizId) {
											k.bizEdited(k.form, k, i.bizId)
										} else {
											k.bizAdded(k.form, k, i.bizId)
										}
									}
								}
								m._vm.setValues(o);
								delete i._c;
								delete i._title
							}
							if (e) {
								if (e == "Save") {
									d._saved = true;
									d.scatter(i);
									d.refreshListGrids(true, false, i)
								} else {
									if (k) {
										if (a.bizId) {
											if (k.bizEditedForServer) {
												WindowStack.popoff(false);
												k.bizEditedForServer(k.form, k,
														i.bizId)
											} else {
												WindowStack.popoff(true)
											}
										} else {
											if (k.bizAddedForServer) {
												WindowStack.popoff(false);
												k.bizAddedForServer(k.form, k,
														i.bizId)
											} else {
												WindowStack.popoff(true)
											}
										}
									} else {
										WindowStack.popoff(true)
									}
								}
							} else {
								d.scatter(i);
								d.refreshListGrids(true, false, i)
							}
							if (b) {
								b(i)
							}
						} else {
							if (p.status == -1) {
								isc.warn(i, null, {
									title : "Problems"
								})
							}
						}
					}, {
						params : f,
						willHandleError : true
					})
				}
			},
			deleteInstance : function(b) {
				var a = this.gather(true);
				if (a) {
					EditView._DATA_SOURCE.removeData(a, function(d, e, c) {
						if (d.status >= 0) {
							WindowStack.popoff(true);
							if (b) {
								b(e)
							}
						} else {
							if (d.status == -1) {
								isc.warn(e, null, {
									title : "Problems"
								})
							}
						}
					}, {
						params : {
							_mod : this._mod,
							_doc : this._doc,
							_c : a._c
						},
						willHandleError : true
					})
				}
			},
			doAction : function(e, j, i, f, b, g, c) {
				var k = this.gather(j);
				if (k) {
					var a = k._c;
					delete k._c;
					var d = {
						_mod : (f ? f : this._mod),
						_doc : (b ? b : this._doc),
						_ecnt : this._ecnt,
						_ccnt : this._ccnt,
						bean : k,
						bizId : (g ? g : k.bizId),
						_c : a
					};
					if (e) {
						d._a = e
					}
					if (this._b) {
						d._b = this._b
					}
					if (i) {
						d._g = i
					}
					var h = this;
					this._vm.disableValidation = true;
					this._vm.saveData(function(m, n, l) {
						if (m.status >= 0) {
							h._saved = true;
							h.scatter(n);
							h.refreshListGrids(true, false, n);
							if (c) {
								c(n)
							}
						} else {
							if (m.status == -1) {
								isc.warn(n, null, {
									title : "Problems"
								})
							}
						}
						return true
					}, {
						params : d,
						willHandleError : true
					});
					this._vm.disableValidation = false
				}
			},
			scatter : function(b) {
				this._vm.clearErrors(true);
				this._vm.clearValues();
				var t = "";
				if (b.persisted) {
					t = '<a target="_top" href="?m='
							+ this._mod
							+ "&d="
							+ this._doc
							+ "&i="
							+ b.bizId
							+ '" title="Link"><img src="images/menu_link.png"/></a>'
				}
				var D = BizUtil.headerTemplate;
				D = D.replace("{modoc}", this._mod + "." + this._doc).replace(
						"{icon}", this._icon).replace("{title}", b._title)
						.replace("{link}", t);
				this._heading.setContents(D);
				delete b._title;
				var o = b._valueMaps;
				delete b._valueMaps;
				this._vm.setValues(b);
				this._processWidgets(this._editPanel, false, b, o);
				for ( var d in this._grids) {
					var G = b[d];
					var m = this._grids[d];
					for ( var q in m) {
						var a = m[q];
						if (G && isc.isAn.Array(G)) {
							if (a._comparisonTree && a._comparisonForm) {
								a.setData(G)
							} else {
								if (a._candidateList && a._memberList) {
									var n = [];
									if (o) {
										var v = o[d];
										if (v) {
											for ( var I in v) {
												var y = v[I];
												var c = G.find("bizId", I);
												if (c) {
													c.bizKey = y
												} else {
													n.push({
														bizId : I,
														bizKey : y
													})
												}
											}
										}
									}
									a.setData(n, G)
								} else {
									if (a.grid) {
										var x = a.grid.fields;
										for (var B = 0, A = x.length; B < A; B++) {
											var p = x[B];
											var h = p.type;
											var F = h.contains("YYYY");
											var u = h.contains("HH");
											if (F || u) {
												var H = p.name;
												for (var C = 0, z = G.length; C < z; C++) {
													var s = G[C];
													var y = s[H];
													if (y) {
														if (F) {
															s[H] = Date
																	.parseSchemaDate(y)
														} else {
															if (u) {
																s[H] = Time
																		.parseInput(y)
															}
														}
													}
												}
											} else {
												if (p.valueMap) {
													if (o) {
														var v = o[d + "_"
																+ p.name];
														if (v) {
															p.valueMap = v
														}
													}
												}
											}
										}
										a.grid.setData(G);
										if (a.selectedIdBinding) {
											var g = b[a.selectedIdBinding];
											if (g) {
												var r = G.findIndex("bizId", g);
												if (r >= 0) {
													var e = a.grid.selectionUpdated;
													a.grid.selectionUpdated = null;
													a.grid
															.selectSingleRecord(r);
													a.grid.selectionUpdated = e
												}
											}
										}
									}
								}
							}
						}
					}
				}
				var w = BizUtil.getCurrentView() == this;
				var E = this._actionPanel.getMembers();
				if (E.length == 0) {
					this._actionPanel.hide()
				}
				for (var C = 0, z = E.length; C < z; C++) {
					var f = E[C];
					if (b.created && (f.forCreate != null) && f.forCreate) {
						this._showHide(f, this._actionPanel, b, true);
						continue
					} else {
						if (b.notCreated && (f.forCreate != null)
								&& (!f.forCreate)) {
							this._showHide(f, this._actionPanel, b, true);
							continue
						}
					}
					this._enableDisable(f, this._actionPanel, b);
					if (f.actionName) {
						if (this._b) {
							this
									._showHide(
											f,
											this._actionPanel,
											b,
											(f.type == "O")
													|| (f.type == "S")
													|| (f.type == "C")
													|| (f.type == "D")
													|| ((f.type == "R") && ((this._openedFromDataGrid === undefined) || (!this._openedFromDataGrid))))
						} else {
							this
									._showHide(
											f,
											this._actionPanel,
											b,
											(f.type == "Z")
													|| (f.type == "R")
													|| ((!b.persisted) && (f.type == "D"))
													|| (w && (f.type == "D"))
													|| (w && (f.type == "O"))
													|| (w && (f.type == "C")))
						}
					}
				}
			},
			refreshListGrids : function(i, g, h) {
				if (i) {
					this._refreshedGrids = {}
				}
				for ( var d in this._grids) {
					var b = this._grids[d];
					for ( var e in b) {
						var a = b[e];
						if (this._refreshedGrids[e]) {
						} else {
							if (a.isVisible()) {
								if (a._map) {
									a.resume();
									a.rerender();
									this._refreshedGrids[e] = true
								} else {
									if (a.rootIdBinding) {
										if (a.hasDataSource()) {
											if (g
													|| (a.postRefreshConditionName === undefined)
													|| this
															._evaluateConditionName(
																	a.postRefreshConditionName,
																	h)) {
												var c = a.grid
														.getDataSource()
														.getField("bizParentId").rootValue;
												var f = "_"
														+ a._view._vm
																.getValue(a.rootIdBinding);
												if (c != f) {
													a
															.setDataSource(a.dataSource)
												} else {
													a.refresh()
												}
											}
										} else {
											a.setDataSource(a.dataSource)
										}
										this._refreshedGrids[e] = true
									} else {
										if (a.dataSource) {
											if (g
													|| (a.postRefreshConditionName === undefined)
													|| this
															._evaluateConditionName(
																	a.postRefreshConditionName,
																	h)) {
												if (a.hasDataSource()) {
													a.refresh()
												} else {
													a
															.setDataSource(a.dataSource)
												}
											}
											this._refreshedGrids[e] = true
										}
									}
								}
							}
						}
					}
				}
			},
			gather : function(b) {
				var a = null;
				if (b) {
					if (this._vm.validate()) {
						a = this._gather()
					}
				} else {
					a = this._gather()
				}
				return a
			},
			_gather : function() {
				var p = this._vm.getValues();
				for ( var j in this._grids) {
					var g = p[j];
					if (isc.isAn.Array(g) && (g.length > 0)) {
						if (g[0].properties) {
							var o = this._grids[j];
							for ( var b in o) {
								p[j] = o[b].getData()
							}
						} else {
							var d = this._grids[j];
							for ( var k in d) {
								var a = d[k];
								var m = [];
								var h = a.grid;
								if (h) {
									m = h.fields;
									h.reorderData();
									g = g.sortByProperty(a._ordinal, true)
								}
								if ((a._candidateList && a._memberList)
										|| ((m.length == 1)
												&& (m[0].name == "bizId") && (m[0].type == "enum"))) {
									if (a._ordinal) {
										a._memberList.reorderData();
										g = g.sortByProperty(a._ordinal, true)
									}
									var e = [];
									p[j] = e;
									for (var f = 0, c = g.length; f < c; f++) {
										var n = g[f];
										e.push(n.bizId)
									}
								}
							}
						}
					}
				}
				return p
			},
			_evaluateConditionName : function(c, b) {
				var a = false;
				if (c) {
					a = ((c == "true") ? true : ((c == "false") ? false : b[c]))
				}
				return a
			},
			_processWidgets : function(c, u, s, g) {
				for (var n = 0, f = c.contained.length; n < f; n++) {
					var q = c.contained[n];
					this._enableDisable(q, c, s);
					var a = u || this._showHide(q, c, s, false);
					if (isA.Function(q.addContained)) {
						this._processWidgets(q, a, s, g)
					}
					if (isA.Function(q.addBizTab)) {
						var r = q.getSelectedTab();
						var b = r ? r.pane : null;
						for (var k = 0, e = q.bizTabs.length; k < e; k++) {
							var h = q.bizTabs[k];
							var o = a || this._showHide(h, q, s, false);
							this._enableDisable(h, q, s);
							if (this._evaluateConditionName(
									h.selectedConditionName, s)) {
								b = h.pane
							}
							this._processWidgets(h.pane, o, s, g)
						}
						if (b) {
							r = q.tabForPane(b);
							if (r) {
								q.selectTab(r)
							}
						}
					}
					if (isA.Function(q.getItems)) {
						if (a) {
							if (this._vm.members
									&& this._vm.members.contains(q)) {
								this._vm.removeMember(q)
							}
						} else {
							if ((this._vm.members == null)
									|| (!this._vm.members.contains(q))) {
								this._vm.addMember(q)
							}
						}
						var p = q.items;
						for (var k = 0, e = p.length; k < e; k++) {
							var t = p[k];
							this._enableDisable(t, q, s);
							if (!this._showHide(t, q, s, false)) {
								if (t.type == "bizLookupDescription") {
									t.setValueMapFromEditView(s);
									t.invalidateCache()
								} else {
									if ((t.type == "select")
											|| (t.type == "enum")
											|| (t.type == "comboBox")) {
										if (t.optionDataSource) {
											if (t.optionDataSource == BizUtil.PREVIOUS_VALUES_DATA_SOURCE) {
												var d = {};
												d[s[t.name]] = s[t.name];
												t.setValueMap(d)
											} else {
												t.fetchData();
												var d = {};
												d[s[t.name]] = s[t.name + "_"
														+ t.displayField];
												t.setValueMap(d)
											}
										} else {
											if (g) {
												var d = g[t.name];
												if (d) {
													t.setValueMap(d)
												}
											}
										}
									}
								}
							}
						}
					}
					if (isA.Function(q.rerender)) {
						q.rerender()
					}
				}
			},
			_enableDisable : function(c, b, a) {
				if (c.disablePickConditionName) {
					c.canPick = !this._evaluateConditionName(
							c.disablePickConditionName, a);
					c.enableDisablePick()
				}
				if (c.disableAddConditionName) {
					c.canAdd = !this._evaluateConditionName(
							c.disableAddConditionName, a)
				}
				if (c.disableZoomConditionName) {
					c.canZoom = !this._evaluateConditionName(
							c.disableZoomConditionName, a)
				}
				if (c.disableEditConditionName) {
					c.canEdit = !this._evaluateConditionName(
							c.disableEditConditionName, a)
				}
				if (c.disableRemoveConditionName) {
					c.canRemove = !this._evaluateConditionName(
							c.disableRemoveConditionName, a)
				}
				if (c.disableClearConditionName) {
					c.canClear = !this._evaluateConditionName(
							c.disableClearConditionName, a)
				}
				this._setDisabled(c, b, c.disabledConditionName, a)
			},
			_setDisabled : function(f, e, g, b) {
				var d = this._evaluateConditionName(g, b);
				if (f.bizRequired && f.setRequired && f.isVisible
						&& f.isVisible()) {
					f.setRequired(!d)
				}
				if (f.setDisabled) {
					f.setDisabled(d)
				} else {
					if (f.enable && f.disable) {
						if (d) {
							f.disable()
						} else {
							f.enable()
						}
					} else {
						if (e && e.enableTab && e.disableTab && f.pane) {
							var c = e.tabForPane(f.pane);
							var a = e.getTabNumber(c);
							if (a >= 0) {
								if (d) {
									e.disableTab(c)
								} else {
									e.enableTab(c)
								}
							}
						}
					}
				}
			},
			setDisabled : function(c, d) {
				var b = this._vm.getItem(c);
				if (b) {
					var a = this.gather(false);
					this._setDisabled(b, null, d, a)
				}
			},
			toggleDisabled : function(b) {
				var a = this._vm.getItem(b);
				if (a) {
					this._setDisabled(a, null, a.isDisabled() ? "false"
							: "true", null)
				}
			},
			_showHide : function(d, c, b, a) {
				return this._setInvisible(d, c, d.invisibleConditionName, b, a)
			},
			_setInvisible : function(f, d, c, b, a) {
				var e = a || false;
				if (!e) {
					e = this._evaluateConditionName(c, b)
				}
				if (f.bizRequired && f.setRequired) {
					if (e) {
						f.setRequired(false)
					} else {
						if (f.isDisabled && (!f.isDisabled())) {
							f.setRequired(true)
						}
					}
				}
				if (f.show && f.hide) {
					if (e) {
						f.hide()
					} else {
						f.show()
					}
				} else {
					if (d) {
						if (e) {
							d.hideMember(f)
						} else {
							d.showMember(f)
						}
					}
				}
				return e
			},
			setInvisible : function(d, b) {
				var c = this._vm.getItem(d);
				if (c) {
					var a = this.gather(false);
					this._setInvisible(c, null, b, a)
				}
			}
		});
isc.ClassFactory.defineClass("BizButton", "IButton");
BizButton
		.addMethods({
			initWidget : function() {
				this.autoFit = !(arguments[0].width || arguments[0].height);
				this.hasDisabledicon = false;
				if (this.displayName) {
					this.title = this.displayName
				}
				if (this.tooltip) {
					this.canHover = true;
					this.getHoverHTML = function() {
						return this.tooltip
					}
				}
				if (this.icon) {
					this.showDisabledIcon = this.hasDisabledIcon
				}
						this.click = function() {
							if (this.confirm) {
								var a = this;
								isc.ask(this.confirm, function(b) {
									if (b) {
										a._click()
									}
								}, {
									title : "Confirm"
								})
							} else {
								this._click()
							}
						},
						this._click = function() {
							if (this.type == "O") {
								this._view.saveInstance(this.actionName)
							} else {
								if (this.type == "S") {
									this._view.saveInstance(this.actionName)
								} else {
									if (this.type == "A") {
									} else {
										if (this.type == "Z") {
											var j = this._view.gather(false)._apply;
											if (j
													|| this._view._vm
															.valuesHaveChanged()) {
												this._view
														.saveInstance(this.actionName)
											} else {
												WindowStack
														.popoff(this._view._saved)
											}
										} else {
											if (this.type == "C") {
												var d = this;
												var b = this._view
														.gather(false)._changed;
												if (b
														|| this._view._vm
																.valuesHaveChanged()) {
													isc
															.ask(
																	"There are unsaved changes in the "
																			+ this._view._singular
																			+ ".  Do you wish to cancel?",
																	function(l) {
																		if (l) {
																			WindowStack
																					.popoff(d._view._saved)
																		}
																	},
																	{
																		title : "Discard Unsaved Changes?"
																	})
												} else {
													WindowStack
															.popoff(d._view._saved)
												}
											} else {
												if (this.type == "D") {
													var d = this;
													isc
															.ask(
																	"Do you want to delete this "
																			+ this._view._singular
																			+ "?",
																	function(l) {
																		if (l) {
																			d._view
																					.deleteInstance()
																		}
																	},
																	{
																		title : "Delete?"
																	})
												} else {
													if (this.type == "R") {
														var i = this._view
																.gather(false).bizId;
														var e = this._view._b;
														e = e
																.substring(
																		e
																				.lastIndexOf(".") + 1,
																		e
																				.lastIndexOf("ElementById"));
														var g = WindowStack
																.getOpener();
														if (g) {
															var k = g._grids[e];
															if (k) {
																for ( var c in k) {
																	var a = k[c];
																	a.remove(i);
																	if (a._view) {
																		if (a.bizRemoved) {
																			a
																					.bizRemoved()
																		}
																	}
																}
															}
															g._vm.setValue(
																	"_apply",
																	true)
														}
														WindowStack
																.popoff(false)
													} else {
														if (this.type == "P") {
															ReportDialog
																	.popupReport(
																			this._view,
																			this.params)
														} else {
															if (this.type == "X") {
																var h = this._view
																		.gather(false);
																if (h) {
																	var d = this;
																	this._view
																			.saveInstance(
																					null,
																					function() {
																						window.location
																								.assign("bizexport.xls?_n="
																										+ d.actionName
																										+ "&_doc="
																										+ d._view._mod
																										+ "."
																										+ d._view._doc
																										+ "&_c="
																										+ h._c
																										+ "&_ctim="
																										+ new Date()
																												.getTime())
																					})
																}
															} else {
																if (this.type == "I") {
																	var h = this._view
																			.gather(false);
																	if (h) {
																		var d = this;
																		this._view
																				.saveInstance(
																						null,
																						function() {
																							var l = "bizImport.xhtml?_a="
																									+ d.actionName
																									+ "&_c="
																									+ h._c;
																							if (d._view._b) {
																								l += "&_b="
																										+ d._view._b
																												.replaceAll(
																														"_",
																														".")
																							}
																							WindowStack
																									.popup(
																											null,
																											"BizPort Import",
																											true,
																											[ isc.HTMLPane
																													.create({
																														contentsType : "page",
																														contents : "Loading Page...",
																														contentsURL : l
																													}) ])
																						})
																	}
																} else {
																	if (this.type == "L") {
																		var h = this._view
																				.gather(false);
																		if (h) {
																			var d = this;
																			this._view
																					.saveInstance(
																							null,
																							function() {
																								window.location
																										.assign("download?_n="
																												+ d.actionName
																												+ "&_doc="
																												+ d._view._mod
																												+ "."
																												+ d._view._doc
																												+ "&_c="
																												+ h._c
																												+ "&_ctim="
																												+ new Date()
																														.getTime())
																							})
																		}
																	} else {
																		if (this.type == "U") {
																			var h = this._view
																					.gather(false);
																			if (h) {
																				var d = this;
																				this._view
																						.saveInstance(
																								null,
																								function() {
																									var l = "fileUpload.xhtml?_a="
																											+ d.actionName
																											+ "&_c="
																											+ h._c;
																									if (d._view._b) {
																										l += "&_b="
																												+ d._view._b
																														.replaceAll(
																																"_",
																																".")
																									}
																									WindowStack
																											.popup(
																													null,
																													"Upload",
																													true,
																													[ isc.HTMLPane
																															.create({
																																contentsType : "page",
																																contents : "Loading Page...",
																																contentsURL : l
																															}) ])
																								})
																			}
																		} else {
																			if (this.type == "M") {
																			} else {
																				var f = this.validate;
																				if (f === undefined) {
																					f = true
																				}
																				this._view
																						.doAction(
																								this.actionName,
																								f)
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						};
				this.Super("initWidget", arguments)
			}
		});
isc.ClassFactory.defineClass("BizVBox", "VLayout");
BizVBox.addMethods({
	initWidget : function() {
		this.contained = [];
		this.Super("initWidget", arguments)
	},
	addContained : function(a) {
		this.contained.add(a);
		this.addMember(a)
	}
});
isc.ClassFactory.defineClass("BizHBox", "HLayout");
BizHBox.addMethods({
	initWidget : function() {
		this.contained = [];
		this.Super("initWidget", arguments)
	},
	addContained : function(a) {
		this.contained.add(a);
		this.addMember(a)
	}
});
isc.ClassFactory.defineClass("BizTabPane", "TabSet");
BizTabPane.addMethods({
	initWidget : function() {
		this.tabs = [];
		this.bizTabs = [];
		this.destroyPanes = false;
		this.tabBarThickness = 30;
		this.Super("initWidget", arguments)
	},
	tabSelected : function(d, b, a, c) {
		if (this._view.isVisible()) {
			this._view.delayCall("refreshListGrids", [ false, false ], 0)
		}
	},
	addBizTab : function(a) {
		this.bizTabs.add(a);
		this.addTab({
			name : a.name,
			title : a.title,
			icon : a.icon,
			pane : a.pane,
			disabledConditionName : a.disabledConditionName,
			invisibleConditionName : a.invisibleConditionName,
			selectedConditionName : a.selectedConditionName
		})
	},
	showMember : function(c) {
		var d = this.getTabNumber(c.name);
		if (d < 0) {
			var b = 0;
			var a = parseInt(c.name);
			a--;
			while (a >= 0) {
				d = this.getTabNumber("" + a);
				if (d >= 0) {
					b = d + 1;
					break
				}
				a--
			}
			this.addTab({
				name : c.name,
				title : c.title,
				pane : c.pane,
				disabledConditionName : c.disabledConditionName,
				invisibleConditionName : c.invisibleConditionName,
				selectedConditionName : c.selectedConditionName
			}, b)
		}
	},
	hideMember : function(a) {
		if (this.getTabNumber(a.name) >= 0) {
			this.removeTab(a.name)
		}
	}
});
isc.ClassFactory.defineClass("BizListMembership", "HLayout");
BizListMembership.addMethods({
	initWidget : function(a) {
		this.membersMargin = 10;
		this.height = "100%";
		var c = this;
		this._candidateList = isc.ListGrid.create({
			width : "100%",
			height : "100%",
			canDragRecordsOut : true,
			canAcceptDroppedRecords : true,
			dragDataAction : "move",
			recordDrop : function(g, d, f, e) {
				this.Super("recordDrop", arguments);
				c._view._vm.setValue("_changed", true);
				c._view._vm.setValue("_apply", true);
				c.changed()
			},
			alternateRecordStyles : true,
			autoFetchData : false,
			leaveScrollbarGap : false,
			showHeaderContextMenu : false,
			fields : [ {
				name : "bizKey",
				title : (this.candidatesHeading ? this.candidatesHeading
						: "Candidates")
			} ]
		});
		this._memberList = isc.ListGrid.create({
			width : "100%",
			height : "100%",
			canDragRecordsOut : true,
			canAcceptDroppedRecords : true,
			dragDataAction : "move",
			canReorderRecords : a._ordinal ? true : false,
			recordDrop : function(g, d, f, e) {
				this.Super("recordDrop", arguments);
				if (e == this) {
					this.reorderData()
				}
				c._view._vm.setValue("_changed", true);
				c._view._vm.setValue("_apply", true);
				c.changed()
			},
			reorderData : function() {
				if (a._ordinal) {
					var f = this.getData();
					for (var e = 0, d = f.length; e < d; e++) {
						f[e][a._ordinal] = e + 1
					}
				}
			},
			alternateRecordStyles : true,
			autoFetchData : false,
			leaveScrollbarGap : false,
			showHeaderContextMenu : false,
			fields : [ {
				name : "bizKey",
				title : (this.membersHeading ? this.membersHeading : "Members")
			} ]
		});
		this.members = [ this._candidateList, isc.VLayout.create({
			layoutAlign : "center",
			membersMargin : 10,
			height : 100,
			members : [ isc.IButton.create({
				icon : "icons/memberAssign.png",
				iconWidth : 24,
				iconHeight : 24,
				iconAlign : "center",
				showText : false,
				width : 32,
				height : 32,
				click : function() {
					c._memberList.transferSelectedData(c._candidateList);
					c._view._vm.setValue("_changed", true);
					c._view._vm.setValue("_apply", true);
					c.changed()
				},
				canHover : true,
				getHoverHTML : function() {
					return "Add the selected candidates."
				}
			}), isc.IButton.create({
				icon : "icons/memberUnassign.png",
				iconWidth : 24,
				iconHeight : 24,
				iconAlign : "center",
				showText : false,
				width : 32,
				height : 32,
				click : function() {
					c._candidateList.transferSelectedData(c._memberList);
					c._view._vm.setValue("_changed", true);
					c._view._vm.setValue("_apply", true);
					c.changed()
				},
				canHover : true,
				getHoverHTML : function() {
					return "Remove the selected members."
				}
			}) ]
		}), this._memberList ];
		this.Super("initWidget", arguments);
		var b = this._view._grids[this._b];
		if (b) {
		} else {
			b = {};
			this._view._grids[this._b] = b
		}
		b[this.getID()] = this
	},
	setData : function(b, a) {
		this._candidateList.setData(b);
		this._memberList.setData(a)
	},
	changed : function() {
	}
});
isc.ClassFactory.defineClass("BizComparison", "HLayout");
BizComparison
		.addMethods({
			initWidget : function() {
				this.canDragResize = true;
				this.resizeFrom = [ "L", "R" ];
				var c = this;
				this._comparisonTree = isc.TreeGrid.create({
					width : "50%",
					height : "100%",
					fields : [ {
						name : "bizKey",
						title : "Document"
					}, {
						name : "relationship",
						title : "Relationship"
					} ],
					data : isc.Tree.create({
						modelType : "parent",
						idField : "bizId",
						parentIdField : "parent",
						data : []
					}),
					selectionUpdated : function(e, d) {
						if (e) {
							c.setFormFields(e.properties)
						}
					},
					showOpenIcons : false,
					showDropIcons : false,
					showResizeBar : true
				});
				var a = function(f) {
					if (f.type != "boolean") {
						if (this.diff_match_patch) {
							var e = f;
							var h = f;
							if (f.name.startsWith("_old_")) {
								e = this.getItem(f.name.substring(5))
							} else {
								h = this.getItem("_old_" + f.name)
							}
							var d = e.getDisplayValue();
							if (d) {
								if (d.startsWith("<")) {
									d = ""
								}
							} else {
								d = ""
							}
							var g = h.getDisplayValue();
							if (g) {
								if (g.startsWith("<")) {
									g = ""
								}
							} else {
								g = ""
							}
							var i = this.diff_match_patch
									.diff_main(g, d, false);
							this.diff_match_patch.diff_cleanupEfficiency(i);
							return this.diff_match_patch.diff_prettyHtml(i)
						}
					}
					return null
				};
				this._comparisonForm = isc.PropertySheet.create({
					width : "100%",
					height : "100%",
					numCols : c.editable ? 5 : 4,
					colWidths : c.editable ? [ 150, "*", 50, "*", 30 ] : [ 150,
							"*", "*", 30 ],
					border : "1px solid #A7ABB4",
					titleHoverHTML : a,
					fields : []
				});
				BizUtil
						.loadJS(
								"desktop/diff_match_patch.js",
								function() {
									c._comparisonForm.diff_match_patch = new diff_match_patch();
									c._comparisonForm.diff_match_patch.Diff_EditCost = 4
								});
				this.members = [ this._comparisonTree, isc.VLayout.create({
					overflow : "auto",
					members : [ this._comparisonForm ]
				}) ];
				this.Super("initWidget", arguments);
				var b = this._view._grids[this._b];
				if (b) {
				} else {
					b = {};
					this._view._grids[this._b] = b
				}
				b[this.getID()] = this
			},
			setData : function(a) {
				this._comparisonTree.setData(isc.Tree.create({
					modelType : "parent",
					idField : "bizId",
					parentIdField : "parent",
					data : a
				}));
				this.setFormFields([])
			},
			setFormFields : function(j) {
				var k = this;
				var g = [ {
					type : "blurb",
					align : "center",
					colSpan : 1,
					defaultValue : "Property",
					startRow : false,
					endRow : false,
					cellStyle : "propSheetTitle"
				}, {
					type : "blurb",
					align : "center",
					colSpan : 1,
					defaultValue : "New",
					startRow : false,
					endRow : false,
					cellStyle : "propSheetTitle"
				} ];
				if (this.editable) {
					g
							.add({
								title : "<<-",
								type : "button",
								click : "for (var i = 5; i < form.getFields().length - 4; i += 4) {var old = form.getField(i + 2).getValue();form.getField(i).setValue(old ? old : '')}",
								startRow : false,
								endRow : false,
								align : "center",
								cellStyle : "propSheetValue",
								titleStyle : null,
								textBoxStyle : null
							})
				}
				g.add({
					type : "blurb",
					align : "center",
					colSpan : 1,
					defaultValue : "Old",
					startRow : false,
					endRow : false,
					cellStyle : "propSheetTitle"
				});
				g.add({
					type : "blurb",
					align : "center",
					colSpan : 1,
					defaultValue : "Diff",
					startRow : false,
					endRow : false,
					cellStyle : "propSheetTitle"
				});
				for (var e = 0; e < j.length; e++) {
					var a = j[e].name;
					var n = j[e].title;
					var l = j[e].type;
					var b = j[e].editorType;
					var c = j[e].length;
					var d = j[e].valueMap;
					var h = j[e].required;
					var f = j[e].allowEmptyValue;
					var m = {
						name : a,
						title : n,
						type : l,
						width : "*",
						canEdit : this.editable,
						defaultValue : j[e].newValue
					};
					var o = {
						name : "_old_" + a,
						type : l,
						width : "*",
						showTitle : false,
						canEdit : false,
						defaultValue : j[e].oldValue
					};
					if (b) {
						m.editorType = b;
						o.editorType = b
					}
					if (c) {
						m.length = c
					}
					if (d) {
						m.valueMap = d;
						o.valueMap = d
					}
					if (h) {
						m.required = h
					}
					if (f) {
						m.allowEmptyValue = f
					}
					g.add(m);
					if (this.editable) {
						g.add({
							title : "<-",
							type : "button",
							click : "var old = form.getField('_old_" + a
									+ "').getValue(); form.getField('" + a
									+ "').setValue(old ? old : '')",
							align : "center",
							startRow : false,
							endRow : false,
							cellStyle : "propSheetValue",
							titleStyle : null,
							textBoxStyle : null
						})
					}
					g.add(o);
					g.add({
						title : "...",
						type : "button",
						click : "isc.say(form.titleHoverHTML(form.getField('"
								+ a + "')),null,{title:'Diff'})",
						align : "center",
						startRow : false,
						endRow : false,
						cellStyle : "propSheetValue",
						titleStyle : null,
						textBoxStyle : null
					})
				}
				if (this.editable) {
					g.add({
						type : "spacer",
						colSpan : 5,
						cellStyle : null,
						titleStyle : null,
						textBoxStyle : null
					});
					g
							.add({
								title : "Apply Changes",
								type : "button",
								colSpan : 4,
								startRow : false,
								endRow : true,
								align : "right",
								cellStyle : null,
								titleStyle : null,
								textBoxStyle : null,
								click : function(t, s) {
									var p = t.getValues();
									var r = k._comparisonTree
											.getSelectedRecord().properties;
									for (var q = 0; q < r.length; q++) {
										var u = r[q];
										u.newValue = p[u.name]
									}
									isc
											.showPrompt('<span style="font-size:medium">Changes Applied</span>');
									Timer.setTimeout("isc.clearPrompt()", 500)
								}
							});
					g.add({
						type : "spacer",
						colSpan : 5,
						cellStyle : null,
						titleStyle : null,
						textBoxStyle : null
					})
				}
				this._comparisonForm.setFields(g);
				this._comparisonForm.clearValues()
			},
			getData : function() {
				var a = this
						._getData(this._comparisonTree.getData().getRoot().children[0]);
				delete a._b;
				delete a._t;
				return a
			},
			_getData : function(h) {
				var j = {
					bizId : h.bizId,
					_b : h._b,
					_t : h._t
				};
				var f = h.properties;
				for (var e = 0; e < f.length; e++) {
					j[f[e].name] = f[e].newValue
				}
				var c = h.children;
				if (c) {
					for (var e = 0; e < c.length; e++) {
						var d = this._getData(c[e]);
						var g = d._b;
						var a = d._t;
						delete d._b;
						delete d._t;
						var b = j[g];
						if (b) {
							if (!isAn.Array(b)) {
								b = [ b ]
							}
							b.add(d)
						} else {
							if (a == "A") {
								j[g] = d
							} else {
								j[g] = [ d ]
							}
						}
					}
				}
				return j
			}
		});
isc.ClassFactory.defineClass("BizDynamicImage", "VLayout");
BizDynamicImage.addMethods({
	initWidget : function() {
		this.showEdges = true;
		this.edgeSize = 2;
		this.overflow = "hidden";
		this.wZoom = 100;
		this.hZoom = 100;
		if (this.parameters) {
		}
		this.members = [];
		var a = this;
		this.mouseWheelTimer = null;
		this.contextMenu = isc.Menu.create({
			showShadow : true,
			shadowDepth : 10,
			data : [ {
				title : "Size",
				icon : "icons/mag.png",
				submenu : [ {
					title : "50%",
					click : function() {
						a._zoom(50)
					}
				}, {
					title : "75%",
					click : function() {
						a._zoom(75)
					}
				}, {
					title : "100%",
					click : function() {
						a._zoom(100)
					}
				}, {
					title : "125%",
					click : function() {
						a._zoom(125)
					}
				}, {
					title : "150%",
					click : function() {
						a._zoom(150)
					}
				}, {
					title : "175%",
					click : function() {
						a._zoom(175)
					}
				}, {
					title : "200%",
					click : function() {
						a._zoom(200)
					}
				}, {
					title : "300%",
					click : function() {
						a._zoom(300)
					}
				}, {
					title : "400%",
					click : function() {
						a._zoom(400)
					}
				}, {
					title : "500%",
					click : function() {
						a._zoom(500)
					}
				} ]
			}, {
				title : "Enlarge",
				icon : "icons/magIn.png",
				click : function() {
					a._zoom(a.wZoom + 10)
				}
			}, {
				title : "Reduce",
				icon : "icons/magOut.png",
				click : function() {
					a._zoom(a.wZoom - 10)
				}
			}, {
				isSeparator : true
			}, {
				title : "Open",
				icon : "zoom.gif",
				click : function() {
					a._open()
				}
			}, {
				isSeparator : true
			}, {
				title : "Refresh",
				icon : "refresh.png",
				click : function() {
					a.rerender()
				}
			} ]
		});
		this.Super("initWidget", arguments)
	},
	_zoom : function(b, a) {
		if (b > 0) {
			this.wZoom = b;
			this.hZoom = b;
			if (a) {
				if (this.mouseWheelTimer) {
					Timer.clear(this.mouseWheelTimer)
				}
				this.mouseWheelTimer = Timer.setTimeout(
						this.ID + ".rerender()", 250)
			} else {
				this.rerender()
			}
		}
	},
	_open : function() {
		var a = BizDynamicImage.create({
			name : this.name,
			moduleDotDocument : this.moduleDotDocument,
			format : this.format,
			_view : this._view
		});
		WindowStack.popup(null, "Image", true, [ a ]);
		a.rerender()
	},
	resized : function() {
		this.rerender()
	},
	rerender : function() {
		var j = this._view._vm.getValue("_c");
		if (j) {
		} else {
			return
		}
		this.mouseWheelTimer = null;
		if (this.members && (this.members.length == 1)) {
			this.removeMember(0);
			if (this._img) {
				this._img.destroy()
			}
		}
		var a = this._view._b;
		var g = this._view._vm.getValue("bizId");
		var d = this.imageWidth ? this.imageWidth
				: (this.getVisibleWidth() - 20);
		var e = this.imageHeight ? this.imageHeight
				: (this.getVisibleHeight() - 20);
		var f = this;
		var i = "dynamic." + this.format + "?_doc=" + this.moduleDotDocument
				+ "&_n=" + this.name;
		if (this.imageWidth) {
			i += "&_w=" + this.imageWidth
		}
		if (this.imageHeight) {
			i += "&_h=" + this.imageHeight
		}
		i += "&_w=" + d + "&_h=" + e + "&_wz=" + this.wZoom + "&_hz="
				+ this.hZoom;
		if (j) {
			i += "&_c=" + j
		}
		if (a) {
			i += "&_b=" + a.replaceAll("_", ".")
		}
		if (g) {
			i += "&bizId=" + g
		}
		i += "&_ts=" + new Date().getTime();
		this._img = isc.Img.create({
			width : "100%",
			height : "100%",
			overflow : "hidden",
			imageWidth : Math.round(d * this.wZoom / 100),
			imageHeight : Math.round(e * this.hZoom / 100),
			imageType : "center",
			canDrag : true,
			cursor : "all-scroll",
			dragAppearance : "none",
			dragStart : function() {
				this.startScrollLeft = this.getScrollLeft();
				this.startScrollTop = this.getScrollTop()
			},
			dragMove : function() {
				this.scrollTo(this.startScrollLeft - isc.Event.lastEvent.x
						+ isc.Event.mouseDownEvent.x, this.startScrollTop
						- isc.Event.lastEvent.y + isc.Event.mouseDownEvent.y)
			},
			mouseWheel : function() {
				var b = isc.EventHandler.getWheelDelta();
				f._zoom(Math.round(f.wZoom - (b * 10)), true);
				return false
			},
			doubleClick : function() {
				f._open()
			},
			src : i
		});
		if (this.members) {
			this.addMember(this._img)
		}
	}
});
isc.ClassFactory.defineClass("BizImage", "Img");
BizImage.addMethods({
	initWidget : function() {
		this.imageType = "stretch";
		this.src = "resources?_n=" + this.file + "&_doc=" + this.modoc
				+ "&_b=null";
		this.Super("initWidget", arguments)
	}
});
isc.ClassFactory.defineClass("BizLabel", "Label");
BizLabel.addMethods({
	initWidget : function() {
		this.autoFit = !(arguments[0].width || arguments[0].height);
		if (this.value) {
			this.setContents(this.value)
		}
		if (this.textAlign) {
			this.setAlign(this.textAlign)
		}
		this.Super("initWidget", arguments)
	}
});
isc.ClassFactory.defineClass("BizProgressBar", "ProgressBar");
BizUtil
		.addClassProperties({
			headerTemplate : null,
			init : function(h, d, c, b) {
				BizUtil.headerTemplate = h;
				isc.HLayout.create({
					ID : "body",
					autoDraw : true,
					width : "100%",
					height : "100%",
					backgroundColor : "whitesmoke",
					padding : 10,
					members : [ isc.VLayout.create({
						ID : "navigation",
						width : "30%",
						showResizeBar : true,
						backgroundColor : "white",
						border : "1px solid #c0c0c0",
						showShadow : true,
						shadowSoftness : 10,
						shadowOffset : 0,
						members : [ isc.Img.create({
							imageType : "center",
							src : d
						}), isc.SectionStack.create({
							ID : "adminStack",
							width : "100%",
							visibilityMode : "mutex",
							animateSections : true,
							overflow : "hidden",
							headerHeight : 20
						}) ]
					}), isc.VLayout.create({
						ID : "details",
						width : "100%",
						height : "100%",
						backgroundColor : "whitesmoke",
						border : "1px solid #c0c0c0",
						showShadow : true,
						shadowSoftness : 10,
						shadowOffset : 0
					}) ]
				});
				for (var e = 0, a = c.length; e < a; e++) {
					var f = c[e];
					var g = isc.TreeGrid
							.create({
								ID : f.name + "Tree",
								showHeader : false,
								showOpenIcons : false,
								showDropIcons : false,
								showConnectors : true,
								showRollOver : false,
								leaveScrollbarGap : false,
								nodeIcon : null,
								folderIcon : null,
								closedIconSuffix : "",
								canDragRecordsOut : true,
								dragDataAction : "copy",
								data : isc.Tree.create({
									modelType : "children",
									nameProperty : "desc",
									childrenProperty : "sub",
									root : f.root
								}),
								leafClick : function(k, i, j) {
									if (i.ref == "link") {
										window.location = i.name
									} else {
										if (i.ref == "edit") {
											if (BizUtil._currentView == ListView.contents) {
												details
														.hideMember(ListView.contents)
											} else {
												if (BizUtil._currentView) {
													if (details
															.hasMember(BizUtil._currentView)) {
														details
																.hideMember(BizUtil._currentView)
													}
													BizUtil
															.relinquishEditView(BizUtil._currentView)
												}
											}
											BizUtil
													.getEditView(
															k.data.root.name,
															i.name,
															function(l) {
																details
																		.addMember(l);
																BizUtil._currentView = l;
																l.newInstance()
															})
										} else {
											if (BizUtil._currentView != ListView.contents) {
												if (BizUtil._currentView) {
													if (details
															.hasMember(BizUtil._currentView)) {
														details
																.hideMember(BizUtil._currentView)
													}
													BizUtil
															.relinquishEditView(BizUtil._currentView)
												}
												BizUtil._currentView = ListView.contents;
												details
														.showMember(ListView.contents)
											}
											if (i.ref == "grid") {
												ListView
														.setGridDataSource(k.data.root.name
																+ "_" + i.name)
											} else {
												if (i.ref == "cal") {
													ListView
															.setCalendarDataSource(k.data.root.name
																	+ "_"
																	+ i.name)
												} else {
													if (i.ref == "tree") {
														ListView
																.setTreeDataSource(k.data.root.name
																		+ "_"
																		+ i.name)
													} else {
														if (i.ref == "map") {
															ListView
																	.setMapDataSource(k.data.root.name
																			+ "_"
																			+ i.name)
														} else {
															alert("Menu ref of "
																	+ i.ref
																	+ "is unknown")
														}
													}
												}
											}
										}
									}
								}
							});
					adminStack.addSection({
						title : f.title,
						expanded : f.open,
						items : [ g ]
					});
					g.getData().openAll()
				}
				for (var e = 0, a = b.length; e < a; e++) {
					var f = b[e];
					f.fields.add({
						name : "operator",
						type : "text",
						hidden : true
					});
					f.fields.add({
						name : "criteria",
						type : "text",
						hidden : true
					});
					f.fields.add({
						name : "bizId",
						primaryKey : true,
						hidden : true
					});
					f.fields.add({
						name : "bizLock",
						hidden : true
					});
					f.fields.addAt({
						name : "bizTagged",
						title : "Tag",
						type : "boolean",
						validOperators : [ "equals" ]
					}, 0);
					f.fields.addAt({
						name : "bizFlagComment",
						title : "Flag"
					}, 1);
					isc.RestDataSource.create({
						ID : f.ID,
						dataFormat : "json",
						dataURL : "smartlist",
						operationBindings : [ {
							operationType : "fetch",
							dataProtocol : "postParams"
						}, {
							operationType : "update",
							dataProtocol : "postParams"
						}, {
							operationType : "add",
							dataProtocol : "postParams"
						}, {
							operationType : "remove",
							dataProtocol : "postParams"
						} ],
						criteriaPolicy : "dropOnChange",
						title : f.title,
						modoc : f.modoc,
						icon : f.icon,
						canCreate : f.canCreate,
						canUpdate : f.canUpdate,
						canDelete : f.canDelete,
						fields : f.fields
					})
				}
				BizUtil._currentView = ListView.contents;
				details.addMember(ListView.contents);
				details.hideMember(ListView.contents);
				isc.RestDataSource.create({
					ID : "textSearch",
					dataFormat : "json",
					dataURL : "search",
					criteriaPolicy : "dropOnChange",
					fields : [ {
						name : "icon",
						title : "Icon"
					}, {
						name : "doc",
						title : "Document"
					}, {
						name : "bizKey",
						title : "Desciption"
					}, {
						name : "excerpt",
						title : "Excerpt"
					}, {
						name : "score",
						title : "Score (%)",
						type : "integer"
					}, {
						name : "data",
						type : "link",
						title : "Data",
						target : "_self"
					}, {
						name : "content",
						type : "link",
						title : "Content",
						target : "_blank"
					} ]
				});
				isc.DynamicForm
						.create({
							ID : "textSearchForm",
							margin : 2,
							width : 500,
							height : 40,
							numCols : 3,
							colWidths : [ 300, 100, 100 ],
							items : [
									{
										name : "query",
										title : "Type and press search or enter",
										type : "text",
										keyPress : function(l, k, j, i) {
											if ((j == "Enter")
													&& k.validate(false)) {
												l.form.doSearch()
											}
										},
										required : true,
										validators : [ {
											clientOnly : true,
											type : "lengthRange",
											min : 4,
											errorMessage : "At least 4 characters are required for a search"
										} ]
									}, {
										name : "searchBtn",
										startRow : false,
										title : "Search",
										type : "button",
										accessKey : "Enter",
										click : function() {
											this.form.doSearch()
										}
									}, {
										name : "message",
										type : "blurb",
										startRow : true,
										colSpan : 3
									} ],
							doSearch : function() {
								if (this.validate()) {
									var i = this.getItem("message");
									i.setValue("");
									textSearchResults.filterData(textSearchForm
											.getValuesAsCriteria())
								}
							}
						});
				isc.ListGrid
						.create({
							ID : "textSearchResults",
							width : "100%",
							height : "100%",
							alternateRecordStyles : true,
							dataSource : "textSearch",
							dataFetchMode : "basic",
							wrapCells : true,
							fixedRecordHeights : false,
							canEdit : false,
							canFreezeFields : false,
							canGroupBy : false,
							canPickFields : false,
							canSort : false,
							fields : [ {
								name : "icon",
								type : "image",
								align : "center",
								imageURLPrefix : "../resources",
								width : 30
							}, {
								name : "doc",
								width : "15%"
							}, {
								name : "bizKey",
								width : "30%"
							}, {
								name : "excerpt",
								width : "55%"
							}, {
								name : "score",
								width : 75
							}, {
								name : "data",
								width : 40,
								align : "center",
								linkText : "Data"
							}, {
								name : "content",
								width : 60,
								align : "center",
								linkText : "Content"
							} ],
							dataProperties : {
								transformData : function(k, m) {
									if (m.status >= 0) {
										var j = k.pop();
										var l = textSearchForm
												.getItem("message");
										var i = "Query took " + j.time
												+ " seconds.";
										if (j.suggestion) {
											i += "  Did you mean <a href=\"#\" onclick=\"var q = textSearchForm.getItem('query'); q.setValue('"
													+ j.suggestion
													+ "'); q.focusInItem(); return false;\">"
													+ j.suggestion + "</a>"
										}
										l.setValue(i)
									}
								}
							}
						})
			},
			popupSearch : function() {
				WindowStack.popup(null, "Text Search", true, [ textSearchForm,
						textSearchResults ]);
				textSearchForm.focusInItem("query");
				textSearchForm.clearValues()
			},
			showPortal : function() {
				if (BizUtil._currentView != ListView.contents) {
					if (BizUtil._currentView) {
						if (details.hasMember(BizUtil._currentView)) {
							details.hideMember(BizUtil._currentView)
						}
						BizUtil.relinquishEditView(BizUtil._currentView)
					}
					BizUtil._currentView = ListView.contents;
					details.showMember(ListView.contents)
				}
				ListView.showPortal()
			},
			showHelp : function(a) {
				if (a) {
				} else {
					if (BizUtil._currentView == ListView.contents) {
						a = "http://www.bizhub.com.au/help/list.html"
					} else {
						a = "http://www.bizhub.com.au/"
					}
				}
				BizUtil.popupFrame(a, "WILDCAT Help", 1024, 768)
			}
		});