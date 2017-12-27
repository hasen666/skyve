package org.skyve.impl.web.faces;

import java.security.Principal;
import java.util.Map;

import javax.faces.FacesException;
import javax.faces.application.FacesMessage;
import javax.faces.application.FacesMessage.Severity;
import javax.faces.component.UIViewRoot;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.faces.event.PhaseId;
import javax.faces.event.PhaseListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.skyve.impl.persistence.AbstractPersistence;
import org.skyve.impl.util.UtilImpl;
import org.skyve.impl.web.AbstractWebContext;
import org.skyve.impl.web.WebUtil;
import org.skyve.impl.web.faces.beans.FacesView;

public class SkyvePhaseListener implements PhaseListener {
	private static final long serialVersionUID = 3757264858610371158L;

	@Override
	public void beforePhase(PhaseEvent event) {
		if (UtilImpl.FACES_TRACE) {
			PhaseId phaseId = event.getPhaseId();
			UtilImpl.LOGGER.info("SkyvePhaseListener - BEFORE " + phaseId + " : responseComplete=" + event.getFacesContext().getResponseComplete());
		}
	}

	@Override
	public void afterPhase(PhaseEvent event) {
		PhaseId phaseId = event.getPhaseId();
		if (UtilImpl.FACES_TRACE) UtilImpl.LOGGER.info("SkyvePhaseListener - AFTER " + phaseId + " : responseComplete=" + event.getFacesContext().getResponseComplete());
		try {
			if (PhaseId.RENDER_RESPONSE.equals(phaseId)) {
				afterResponseRendered(event);
			}
			else if (PhaseId.RESTORE_VIEW.equals(phaseId)) {
				afterRestoreView(event);
			}
			else if (PhaseId.UPDATE_MODEL_VALUES.equals(phaseId)) {
				afterUpdateModelValues(event);
			}
			// The bean issued a HTTP redirect response
			else if (event.getFacesContext().getResponseComplete()) {
				afterResponseRendered(event);
			}
		}
		catch (Exception e) {
			throw new FacesException(e);
		}
	}

	@Override
	public PhaseId getPhaseId() {
		return PhaseId.ANY_PHASE;
	}
	
	private static void afterRestoreView(PhaseEvent event)
	throws Exception {
		FacesContext fc = event.getFacesContext();
		ExternalContext ec = fc.getExternalContext();
		Map<String, Object> s = ec.getSessionMap();
		UIViewRoot vr = fc.getViewRoot();

		// restore from the session - used when http redirect is used to navigate to a new view
		// restore from the view root - used when within the same view-scoped bean
		if (s.containsKey(FacesUtil.MANAGED_BEAN_NAME_KEY)) {
			if (UtilImpl.FACES_TRACE) UtilImpl.LOGGER.info("SkyvePhaseListener - SET PERSISTENCE FROM SESSION");
			FacesView<?> view = (FacesView<?>) s.get(FacesUtil.MANAGED_BEAN_NAME_KEY);
			restore(view, ec);
		}
		else if (vr != null) {
			String managedBeanName = (String) vr.getAttributes().get(FacesUtil.MANAGED_BEAN_NAME_KEY);
			if (managedBeanName != null) {
				if (UtilImpl.FACES_TRACE) UtilImpl.LOGGER.info("SkyvePhaseListener - SET PERSISTENCE FROM VIEW");
				FacesView<?> view = FacesUtil.getManagedBean(managedBeanName);
				restore(view, ec);
			}
		}

		// initialise the conversation
		AbstractPersistence persistence = AbstractPersistence.get();
		if (UtilImpl.FACES_TRACE) UtilImpl.LOGGER.info("SkyvePhaseListener - CONNECT PERSISTENCE AND BEGIN TRANSACTION");
		persistence.begin();
		HttpServletRequest request = (HttpServletRequest) ec.getRequest();
    	Principal userPrincipal = request.getUserPrincipal();
    	WebUtil.processUserPrincipalForRequest(request, (userPrincipal == null) ? null : userPrincipal.getName(), true);
	}

	private static void restore(FacesView<?> view, ExternalContext ec)
	throws Exception {
		// restore the context
		AbstractWebContext webContext = WebUtil.getCachedConversation(view.getDehydratedWebId(),
																		(HttpServletRequest) ec.getRequest(),
																		(HttpServletResponse) ec.getResponse());
		if (webContext != null) { // should always be the case
			view.hydrate(webContext);
	
			// place the conversation into the thread
			AbstractPersistence persistence = webContext.getConversation();
			persistence.setForThread();
		}
	}

	private static void afterUpdateModelValues(PhaseEvent event) {
		UIViewRoot vr = event.getFacesContext().getViewRoot();
		if (vr != null) {
			// Gather an dual list models in the view.
			String managedBeanName = (String) vr.getAttributes().get(FacesUtil.MANAGED_BEAN_NAME_KEY);
			if (managedBeanName != null) {
				FacesView<?> view = FacesUtil.getManagedBean(managedBeanName);
				view.getDualListModels().gather();
			}
		}
	}

	private static void afterResponseRendered(PhaseEvent event)
	throws Exception {
		try {
			UIViewRoot vr = event.getFacesContext().getViewRoot();
			if (vr != null) {
				// Cache and dehydrate
				String managedBeanName = (String) vr.getAttributes().get(FacesUtil.MANAGED_BEAN_NAME_KEY);
				if (managedBeanName != null) {
					FacesView<?> view = FacesUtil.getManagedBean(managedBeanName);
					AbstractWebContext webContext = view.getWebContext();
					Severity maximumSeverity = event.getFacesContext().getMaximumSeverity();
					if ((maximumSeverity == null) || 
							(maximumSeverity.getOrdinal() < FacesMessage.SEVERITY_ERROR.getOrdinal())) {
						WebUtil.putConversationInCache(webContext);
					}
					view.dehydrate();
				}
			}
		}
		finally {
			// We can't rely on the SkyveFacesFilter to disconnect persistence under every circumstance.
			// If the web container forwards to an xhtml page (say through web.xml), the SkyveFacesFilter isn't invoked.
			// The SkyveFacesFilter is the last line of defence but usually if the Faces lifecycle is successful
			// the code below will do the disconnect.
			if (UtilImpl.FACES_TRACE) UtilImpl.LOGGER.info("SkyvePhaseListener - COMMIT TRANSACTION AND DISCONNECT PERSISTENCE");
			AbstractPersistence persistence = AbstractPersistence.get();
			persistence.commit(true);
			if (UtilImpl.FACES_TRACE) WebUtil.logConversationsStats();
		}
	}
}
