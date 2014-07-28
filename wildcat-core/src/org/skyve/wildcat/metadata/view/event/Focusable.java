package org.skyve.wildcat.metadata.view.event;

import java.util.List;

public interface Focusable {
	public List<EventAction> getFocusActions();
	public List<EventAction> getBlurActions();
}
