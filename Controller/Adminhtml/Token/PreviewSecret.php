<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Token;

class PreviewSecret extends \Magento\Backend\App\Action
{
    protected $configurationHelper;
    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider
     */
    protected $previewSecretProvider;


    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider $previewSecretProvider
    ) {
        parent::__construct($context);
        $this->previewSecretProvider = $previewSecretProvider;
    }

    public function execute()
    {
        $secretPreviewToken = '';

        if ($this->_auth->isLoggedIn()) {
            $secretPreviewToken = $this->previewSecretProvider->execute($this->getRequest()->getParam('configuration'));
        }

        $result = $this->resultFactory->create(\Magento\Framework\Controller\ResultFactory::TYPE_JSON);
        $result->setData($secretPreviewToken);

        return $result;
    }
}
