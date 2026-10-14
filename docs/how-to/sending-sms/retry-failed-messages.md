---
title: Retry confirmed-safe failures
description: Retry only failures known to occur before Android accepted the SMS attempt.
sidebar_position: 2
---

# Retry confirmed-safe failures

Retry only when SMSApp records a confirmed pre-dispatch failure, such as readiness being revoked before the modem call. First correct the cause: restore connectivity, permission, the default SMS subscription, sender enrollment, or service state.

Do not automatically retry an uncertain result. A timeout, app interruption, or lost callback after Android may have accepted the message can leave SMSApp unable to prove whether the recipient was already attempted. Check the handset and carrier state, then make an explicit reconciliation decision.

Never retry excluded destinations. The Pakistani ordinary-mobile policy applies again at dispatch and has no override.
