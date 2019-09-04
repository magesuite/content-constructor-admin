<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Token;

class Generator extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Backend\App\Action\Context
     */
    protected $context;

    /**
     * @var \Magento\Framework\Controller\Result\RawFactory
     */
    protected $resultRawFactory;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $pageFactory;

    /**
     * @var Magento\Integration\Model\Oauth\TokenFactory
     */
    protected $tokenFactory;

    /**
     * @var \Magento\Backend\Model\Auth\Session
     */
    protected $authSession;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\TokenValidator
     */
    protected $tokenValidator;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\View\Result\PageFactory $pageFactory,
        \Magento\Integration\Model\Oauth\TokenFactory $tokenFactory,
        \Magento\Backend\Model\Auth\Session $authSession,
        \MageSuite\ContentConstructorAdmin\Service\TokenValidator $tokenValidator
    ) {
        parent::__construct($context);

        $this->context = $context;
        $this->resultRawFactory = $resultRawFactory;
        $this->pageFactory = $pageFactory;
        $this->tokenFactory = $tokenFactory;
        $this->authSession = $authSession;
        $this->tokenValidator = $tokenValidator;
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|\Magento\Framework\App\ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute()
    {
        $resultRaw = $this->resultRawFactory->create();

        $currentUserId = $this->authSession->getUser()->getId();

        $token = $this->tokenFactory
            ->create()
            ->loadByAdminId($currentUserId);

        if ($this->tokenValidator->isTokenExpired($token)) {
            $token->delete();
            $token = null;
        }

        if ($token === null) {
            $token = $this->tokenFactory
                ->create()
                ->createAdminToken($currentUserId);
        }

        return $resultRaw->setContents($token->getToken());
    }
}
