<?php

namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Media;

class Uploader extends \Magento\Mtf\Block\Block
{
    private $uploadedFileBoxSelector = "//*[contains(@class, 'filecnt')]//small[contains(text(),'%s')]//parent::div";
    private $insertFilesButtonSelector = "#insert_files";

    public function pickFile($fileName) {
        $uploadedFileBoxSelector = sprintf($this->uploadedFileBoxSelector, $fileName);

        $this->browser->find($uploadedFileBoxSelector, \Magento\Mtf\Client\Locator::SELECTOR_XPATH)->click();
        $this->browser->find($this->insertFilesButtonSelector)->click();
    }
}