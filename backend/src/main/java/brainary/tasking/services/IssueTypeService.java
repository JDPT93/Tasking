package brainary.tasking.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.IssueTypeEntity;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.IssueTypeRepository;
import brainary.tasking.schemas.IssueTypeSchema;

@Service
public class IssueTypeService {

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IssueTypeRepository issueTypeRepository;

    public IssueTypeSchema create(IssueTypeSchema issueTypeSchema) {
        if (issueTypeRepository.existsById(issueTypeSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("issue-type.conflict", null, LocaleContextHolder.getLocale()));
        }
        issueTypeSchema.setActive(true);
        return modelMapper.map(issueTypeRepository.save(modelMapper.map(issueTypeSchema, IssueTypeEntity.class)), IssueTypeSchema.class);
    }

    public IssueTypeSchema deleteById(Integer issueTypeId) {
        IssueTypeSchema issueTypeSchema = retrieveById(issueTypeId);
        issueTypeRepository.deleteById(issueTypeId);
        return issueTypeSchema;
    }

    public Page<IssueTypeSchema> retrieveAll(Pageable pageable) {
        return issueTypeRepository.findAll(pageable).map(issueTypeEntity -> modelMapper.map(issueTypeEntity, IssueTypeSchema.class));
    }

    public IssueTypeSchema retrieveById(Integer issueTypeId) {
        return modelMapper.map(issueTypeRepository.findById(issueTypeId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("issue-type.not-found", null, LocaleContextHolder.getLocale()))), IssueTypeSchema.class);
    }

    public ChangelogPayload<IssueTypeSchema> update(IssueTypeSchema newIssueTypeSchema) {
        IssueTypeSchema oldIssueTypeSchema = retrieveById(newIssueTypeSchema.getId());
        newIssueTypeSchema.setActive(oldIssueTypeSchema.getActive());
        issueTypeRepository.save(modelMapper.map(newIssueTypeSchema, IssueTypeEntity.class));
        return ChangelogPayload.<IssueTypeSchema>builder()
            .before(oldIssueTypeSchema)
            .after(newIssueTypeSchema)
            .build();
    }

}
