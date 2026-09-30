<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Model\Editor;

class MediaUploaderUrlProvider
{
    protected const string WYSIWYG_ROOT_PATH = 'wysiwyg';

    public function __construct(
        protected \Magento\Backend\Model\UrlInterface $backendUrl,
        protected \Magento\Ui\Component\Form\Element\DataType\Media\OpenDialogUrl $openDialogUrl,
        protected \Magento\Cms\Helper\Wysiwyg\Images $imagesHelper
    ) {
    }

    public function getUrl(): string
    {
        return $this->backendUrl->getUrl(
            $this->openDialogUrl->get(),
            ['current_tree_path' => $this->imagesHelper->idEncode(self::WYSIWYG_ROOT_PATH)]
        );
    }
}
